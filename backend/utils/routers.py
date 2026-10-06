import asyncio
import routeros_api
from typing import List, Dict, Any
from aiomysql import Connection, pool
from fastapi import Depends
from backend.schemas.router_schemas import RouterConnect
from backend.utils.security import get_current_perusahaan
from werkzeug.security import generate_password_hash
from config import database_connection

async def get_single_router_bandwidth(router_item: dict) -> Dict[str, Any]:
    """Helper async untuk mengeksekusi koneksi API router tanpa mengganggu event loop."""
    host = router_item.get("ip_address") or router_item.get("host") or router_item.get("ip")
    port = router_item.get("port") or 3237
    user = router_item.get("username") or "admin"
    password = router_item.get("password") or ""

    if not host:
        return {"status": "offline", "download_kbps": 0.0, "upload_kbps": 0.0}

    # Menjalankan fungsi synchronous RouterOS API di threadpool agar backend tidak lag
    return await asyncio.to_thread(
        _fetch_routeros_traffic, 
        host, 
        port, 
        user, 
        password
    )


def _fetch_routeros_traffic(host: str, port: int, user: str, password: str) -> Dict[str, Any]:
    """Fungsi pembantu synchronous untuk koneksi langsung ke MikroTik API."""
    try:
        connection = routeros_api.RouterOsApiPool(
            host=host,
            username=user,
            password=password,
            port=int(port),
            plaintext_login=True
        )
        api = connection.get_api()
        resource = api.get_resource('/interface')
        
        # Ambil monitor-traffic dari interface VPN SSTP
        traffic_data = resource.call('monitor-traffic', {
            'interface': 'vpn-remote-sstp-routereza',
            'once': ''
        })
        connection.disconnect()

        raw_rx = int(traffic_data[0].get('rx-bits-per-second', 0))
        raw_tx = int(traffic_data[0].get('tx-bits-per-second', 0))

        return {
            "status": "online",
            "download_kbps": round(raw_rx / 1000, 2),
            "upload_kbps": round(raw_tx / 1000, 2)
        }
    except Exception:
        return {"status": "offline", "download_kbps": 0.0, "upload_kbps": 0.0}

# function untuk mengecek apakah router masih aktif atau tidak
async def check_router_status(host: str, port: int = 8728) -> str:
    if not host:
        print("[DEBUG] Host bernilai None / Kosong!")
        return "offline"
        
    try:
        port = int(port)
        print(f"[DEBUG] Mencoba connect ke {host}:{port} ...")
        
        _, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port), 
            timeout=3.0
        )
        writer.close()
        await writer.wait_closed()
        print(f"[DEBUG] Sukses connect ke {host}:{port} (ONLINE)")
        return "online"
    except Exception as e:
        print(f"[DEBUG Error Ping {host}:{port}]: {type(e).__name__} - {e}")
        return "offline"

# mengambil data dari router

def connect_to_router(data: RouterConnect):
    try:
        connection =  routeros_api.RouterOsApiPool(
            data.host,
            username = data.username_router,
            password = data.password_router,
            port = int(data.port),
            plaintext_login = False
        )

        return connection
    
    except Exception as e:
        raise e

# mengambil data customer yang sedang aktif

async def get_active(data: RouterConnect):
    connection = connect_to_router(data)

    if not connection:
        raise Exception("Gagal terhubung ke RouterOS api")
    
    try:
        api = connection.get_api()
        active = api.get_resource('/ppp/active').get()

        connection.disconnect()

        return active
    
    except Exception as e:
        raise e

async def get_profile(data: RouterConnect):
    connection = connect_to_router(data)

    if not connection:
        raise Exception("Gagal terhubung ke RouterOS api")
    
    try:
        api = connection.get_api()
        profiles = api.get_resource('/ppp/profile').get()

        formatted_profiles = []
        for profile in profiles:
            formatted_profiles.append({
                "id_profile": profile.get(".id"),
                "nama_paket": profile.get("name"),
                "local_address": profile.get("local-address", "-"),
                "remote_address": profile.get("remote-address", "-"),
                "rate_limit": profile.get("rate-limit", "Unlimited"),
                "is_default": profile.get("default", "false")
            })
            
        return formatted_profiles

    except Exception as e:
        raise e
    

# mengambil data pelanggan 

async def get_secret(data: RouterConnect):
    connection = connect_to_router(data)

    if not connection:
        raise Exception("Gagal terhubung ke RouterOS api")
    
    try:
        api = connection.get_api()
        secrets = api.get_resource('/ppp/secret').get()

        connection.disconnect()
        return secrets

    except Exception as e:
        raise e
    
# Mengambil data paket pada router mikrotik

async def add_profile(data: RouterConnect, nama_paket: str, limits: str, only_one: str):
    connection = connect_to_router(data)

    if not connection:
        raise Exception("Gagal terhubung ke RouterOS api")
    
    try:
        api = connection.get_api()
        ppp_profile = api.get_resource("/ppp/profile")

        exist_profile = ppp_profile.get(name=nama_paket)
        if not exist_profile:
            ppp_profile.add(
                name=nama_paket,
                rate_limit=limits,
                only_one=only_one
            )
        else:
            pass

    except Exception as e:
        raise e
    
# edit data paket pada router mikrotik 

async def edit_profile(data: RouterConnect, id_profile: int, nama_paket: str, limits: str, only_one: str):
    connection = connect_to_router(data)

    if not connection:
        raise Exception("Gagal terhubung ke RouterOS api")
    
    try:
        api = connection.get_api()
        ppp_profile = api.get_resource("/ppp/profile")

        exist_profile = ppp_profile.get(name=nama_paket)
        if exist_profile:
            ppp_profile.set(
                id=id_profile,
                name=nama_paket,
                rate_limit=limits,
                only_one=only_one
            )
        else:
            pass

    except Exception as e:
        raise e
    
async def delete_profile(data: RouterConnect, id_profile: int):
    connection = connect_to_router(data)

    if not connection:
        raise Exception("Gagal terhubung ke RouterOS api")
    
    try:
        api = connection.get_api()
        ppp_profile = api.get_resource("/ppp/profile")

        ppp_profile.remove(
            id=id_profile
        )

    except Exception as e:
        raise e

async def add_data_pelanggan(current_id: int = Depends(get_current_perusahaan), conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT COUNT(*) as total from tbl_pelanggan WHERE id_perusahaan = %s", (current_id,))
            result = await cursor.fetchone()

            if result['total'] > 0:
                print('Database sudah ada isinya, mengabaikan auto-import!')
                return {"status": "skipped", "message": "Database sudah terisi."}
            
            await cursor.execute("SELECT * FROM tbl_router WHERE id_perusahaan = %s", (current_id,))
            list_router = await cursor.fetchall()

            if not list_router:
                print('Belum ada data router di tbl_router, sinkronisasi dihentikan.')
                return {"status": "skipped", "message": "Router belum didaftarkan."}
            
            print(f"Menemukan {len(list_router)} Router di database, memulai proses sinkronisasi")

            for router in list_router:
                id_router = router['id_router']
                label_router = router['label_router']

                print(f"Menghubungkan ke Router : {label_router}, ({router['host']})..")

                # Mengamankan fallback port default 8728 jika null di DB
                router_port = router['port'] if router['port'] is not None else 8728

                user_connect = RouterConnect(
                    host=router['host'],
                    username_router=router['username_router'],
                    password_router=router['password_router'],
                    port=router_port
                )

                user = await get_secret(data=user_connect)

                if not user:
                    print('Tidak ada data di dalam secret atau router gagal connect')
                    continue

                print(f"Terdapat {len(user)} User di Router Mikrotik. Memulai auto-import!")

                for secret in user:
                    username = secret.get('name')
                    profile = secret.get('profile')
                    mac = secret.get('caller-id')

                    if mac == "" or mac == "id" or mac is None:
                        mac = None

                    # Cek paket internet berdasarkan profile mikrotik dan id_perusahaan
                    await cursor.execute("SELECT id_paket FROM tbl_paket WHERE nama_paket = %s AND id_perusahaan = %s", (profile, current_id))
                    paket_db = await cursor.fetchone()

                    if paket_db:
                        id_paket = paket_db['id_paket']
                    else:
                        await cursor.execute("INSERT INTO tbl_paket (nama_paket, harga, id_perusahaan) VALUES (%s, %s, %s)", (profile, 0, current_id))
                        id_paket = cursor.lastrowid

                    # --- FORMULASI DATA AKUN PELANGGAN ---
                    username_aplikasi = username.lower().replace(" ", "") # membuat username aplikasi tanpa spasi dan huruf kecil
                    email_aplikasi = f"{username_aplikasi}@mikrotik.net"
                    password_hash = generate_password_hash("123456") # Password default aplikasi pelanggan

                    
                    query_insert = """
                        INSERT INTO tbl_pelanggan 
                        (id_perusahaan, id_router, id_paket, nama_pelanggan, username_ppoe, username_aplikasi, password_aplikasi, mac_pelanggan) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    
                    variables = (
                        current_id,         # id_perusahaan
                        id_router,          # id_router
                        id_paket,           # id_paket
                        username,           # nama_pelanggan (Nama asli dari Mikrotik)
                        email_aplikasi,     # username_ppoe (Id rahasia PPPoE di Mikrotik)
                        username_aplikasi,  # username_aplikasi (Untuk login ke mobile/web client NocSphere)
                        password_hash,      # password_aplikasi (Hasing password "123456")
                        mac                 # mac_pelanggan (Caller ID jika ada)
                    )

                    await cursor.execute(query_insert, variables)
                
                # Commit data per router selesai diproses
                await conn.commit()
            
            return {"status": "success", "message": "Bulk auto-import pelanggan berhasil disinkronkan!"}

    except Exception as e:
        await conn.rollback()
        print(f"Gagal mengkoneksikan Mikrotik / Proses SQL Error: {e}")
        return {"status": "error", "detail": str(e)}