import asyncio
from typing import List
from config import database_connection
import routeros_api
from fastapi.concurrency import run_in_threadpool
from fastapi import APIRouter, Depends, Query, HTTPException, status, WebSocket, WebSocketDisconnect
from backend.schemas.router_schemas import RouterCreate, RouterResponse, RouterUpdate, RouterConnect, ProfileCreate
from backend.utils.security import generate_password_hash, check_password_hash, get_current_perusahaan
from backend.utils.routers import get_active, get_profile, get_secret, add_profile, edit_profile, delete_profile, connect_to_router, check_router_status, get_single_router_bandwidth, _fetch_routeros_traffic
from aiomysql import Connection

router = APIRouter( 
    prefix="/api/router",
    tags=["Router Management"]
)

# route untuk melihat data router yang akan dipakai sebagai penggambilan data
@router.get("", response_model=dict)
async def get_router_by_id(
    id_router: int,
    interface_name: str = Query(
        "ether1-WAN", description="Nama interface router yang ingin dipantau"
    ),
    current_id: int = Depends(get_current_perusahaan),
    conn: Connection = Depends(database_connection),
):
    # 1. Ambil Data Router dari Database
    async with conn.cursor() as cursor:
        # Sebutkan kolom secara eksplisit agar aman untuk dict maupun tuple
        await cursor.execute(
            """
            SELECT host, username_router, password_router, port, label_router 
            FROM tbl_router 
            WHERE id_router = %s AND id_perusahaan = %s
            """,
            (id_router, current_id),
        )
        router_row = await cursor.fetchone()

    if not router_row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Router dengan ID {id_router} tidak ditemukan.",
        )

    # Parsing data database (Aman untuk DictCursor maupun Tuple Cursor)
    if isinstance(router_row, dict):
        host = router_row.get("host")
        username = router_row.get("username_router")
        password = router_row.get("password_router")
        port = int(router_row.get("port", 8728))
        label_router = router_row.get("label_router", "N/A")
    else:
        host, username, password, port, label_router = (
            router_row[0],
            router_row[1],
            router_row[2],
            int(router_row[3]),
            router_row[4] if len(router_row) > 4 else "N/A",
        )

    # 2. Fungsi Synchronous untuk Komunikasi dengan MikroTik Router
    def fetch_mikrotik_data():
        router_data = RouterConnect(
            host=host, username_router=username, password_router=password, port=port
        )
        connection = connect_to_router(data=router_data)

        try:
            api = connection.get_api()

            # Ambil System Resource (/system/resource)
            resource_api = api.get_resource("/system/resource")
            resource_raw = resource_api.get()
            resource_data = resource_raw[0] if resource_raw else {}

            cpu_load = int(resource_data.get("cpu-load", 0))

            total_ram = int(resource_data.get("total-memory", 0))
            free_ram = int(resource_data.get("free-memory", 0))
            used_ram = total_ram - free_ram
            ram_percent = (
                round((used_ram / total_ram) * 100, 2) if total_ram > 0 else 0.0
            )

            total_disk = int(resource_data.get("total-hdd-space", 0))
            free_disk = int(resource_data.get("free-hdd-space", 0))
            used_disk = total_disk - free_disk
            disk_percent = (
                round((used_disk / total_disk) * 100, 2) if total_disk > 0 else 0.0
            )

            # Ambil Traffic Bandwidth (/interface monitor-traffic)
            interface_api = api.get_resource("/interface")
            traffic_raw = interface_api.call(
                "monitor-traffic", {"interface": interface_name, "once": ""}
            )
            traffic_data = traffic_raw[0] if traffic_raw else {}

            rx_bps = int(traffic_data.get("rx-bits-per-second", 0))
            tx_bps = int(traffic_data.get("tx-bits-per-second", 0))

            return {
                "system_resource": {
                    "uptime": resource_data.get("uptime", "N/A"),
                    "cpu_load_percent": cpu_load,
                    "ram": {
                        "total_bytes": total_ram,
                        "used_bytes": used_ram,
                        "free_bytes": free_ram,
                        "usage_percent": ram_percent,
                    },
                    "disk": {
                        "total_bytes": total_disk,
                        "used_bytes": used_disk,
                        "free_bytes": free_disk,
                        "usage_percent": disk_percent,
                    },
                },
                "bandwidth": {
                    "interface": interface_name,
                    "rx_bps": rx_bps,
                    "tx_bps": tx_bps,
                    "rx_kbps": round(rx_bps / 1024, 2),
                    "tx_kbps": round(tx_bps / 1024, 2),
                    "rx_mbps": round(rx_bps / (1024 * 1024), 2),
                    "tx_mbps": round(tx_bps / (1024 * 1024), 2),
                },
            }
        finally:
            if hasattr(connection, "close"):
                connection.close()

    # 3. Eksekusi panggilan MikroTik di Threadpool (Non-blocking untuk Async Event Loop)
    try:
        data = await run_in_threadpool(fetch_mikrotik_data)
        return {
            "label_router": label_router,
            "id_router": id_router,
            "host": host,
            "port": port,
            "status": "connected",
            **data,
        }
    except Exception as e:
        print(f"Gagal terhubung ke router {host}:{port}. Error: {str(e)}")
        return {
            "label_router": label_router,
            "id_router": id_router,
            "host": host,
            "port": port,
            "status": "disconnected",
            "system_resource": {},
            "bandwidth": {},
        }

# take data from table 

@router.get("/id", response_model=dict)
async def get_router_by_ids(
    router_id: int,
    current_id: int = Depends(get_current_perusahaan),
    conn: Connection = Depends(database_connection)
):
    try:
        async with conn.cursor() as cursor:
            query = "SELECT * FROM tbl_router WHERE id_router = %s AND id_perusahaan = %s"
            await cursor.execute(query, (router_id, current_id))
            router = await cursor.fetchone()

        if not router:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Router not found")

        return router

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database Error! {e}"
        )

# test koneksi routeros api

@router.get("/test", response_model=dict)
async def test_router_connection(
    host: str,
    port: int = 8728,
    username_router: str | None = None,
    password_router: str = "",
):
    connection = None
    try:
        router_data = RouterConnect(
            host=host,
            username_router=username_router,
            password_router=password_router,
            port=port,
        )

        # 1. Inisialisasi pool koneksi
        connection = connect_to_router(data=router_data)

        # 2. Memaksa login & autentikasi ke RouterOS API
        api = connection.get_api()

        return {
            "status": "success",
            "message": f"Berhasil terhubung ke router {host}:{port}",
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Gagal terhubung ke Router: {str(e)}",
        )
    finally:
        # Selalu tutup koneksi jika pernah dibuka
        if connection and hasattr(connection, "disconnect"):
            try:
                connection.disconnect()
            except Exception:
                pass

@router.get("/list", response_model=List[RouterResponse])  # Gunakan List[...] jika return array
async def get_router(
    current_id: int = Depends(get_current_perusahaan), 
    conn: Connection = Depends(database_connection)
):
    try:
        # Gunakan DictCursor agar hasil query berbentuk Dictionary / Dict (bukan Tuple)
        async with conn.cursor() as cursor:
            # SQL dibetulkan: WHERE sebelum ORDER BY
            query = """
                SELECT * FROM tbl_router 
                WHERE id_perusahaan = %s 
                ORDER BY id_router DESC
            """
            # Parameter tuple membutuhkan koma trailing: (current_id,)
            await cursor.execute(query, (current_id,))
            routers = await cursor.fetchall()

        if not routers:
            return []

        # Ping status secara paralel
        tasks = [
            check_router_status(
                r.get("host") or r.get("ip"), 
                r.get("port") or 8728
            ) 
            for r in routers
        ]
        statuses = await asyncio.gather(*tasks)

        # Assign status ke objek dictionary
        for router_item, status_result in zip(routers, statuses):
            router_item["status"] = status_result

        return routers

    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database Error! {e}"
        )

@router.get("/bandwidth/avg")
async def get_average_bandwidth(
    current_id: int = Depends(get_current_perusahaan),
    conn = Depends(database_connection)
):
    try:
        # 1. Ambil daftar router dari database
        async with conn.cursor() as cursor:
            query = """
                SELECT * FROM tbl_router 
                WHERE id_perusahaan = %s
            """
            await cursor.execute(query, (current_id,))
            routers = await cursor.fetchall()

        if not routers:
            return {
                "total_routers": 0,
                "online_routers": 0,
                "offline_routers": 0,
                "avg_download_kbps": 0.0,
                "avg_upload_kbps": 0.0,
                "avg_download_mbps": 0.0,
                "avg_upload_mbps": 0.0
            }

        # 2. Ambil data bandwidth seluruh router secara paralel
        tasks = [get_single_router_bandwidth(r) for r in routers]
        bw_results = await asyncio.gather(*tasks)

        # 3. Filter hanya router yang online
        online_routers = [res for res in bw_results if res["status"] == "online"]
        total_online = len(online_routers)
        total_routers = len(routers)

        # 4. Hitung rata-rata
        if total_online > 0:
            sum_download = sum(r["download_kbps"] for r in online_routers)
            sum_upload = sum(r["upload_kbps"] for r in online_routers)
            avg_download = round(sum_download / total_online, 2)
            avg_upload = round(sum_upload / total_online, 2)
        else:
            avg_download = 0.0
            avg_upload = 0.0

        return {
            "total_routers": total_routers,
            "online_routers": total_online,
            "offline_routers": total_routers - total_online,
            "avg_download_kbps": avg_download,
            "avg_upload_kbps": avg_upload,
            "avg_download_mbps": round(avg_download / 1000, 2),
            "avg_upload_mbps": round(avg_upload / 1000, 2)
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menghitung statistik bandwidth: {e}"
        )
    

@router.post("/add", response_model=dict, status_code=status.HTTP_201_CREATED)
async def add_router(
    data: RouterCreate, 
    current_id: int = Depends(get_current_perusahaan), 
    conn: Connection = Depends(database_connection)
):
    try:
        async with conn.cursor() as cursor:
            # 1. Insert data router baru & ambil ID-nya
            query_router = """
                INSERT INTO tbl_router (label_router, host, username_router, password_router, port, latitude, longitude, id_perusahaan) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            await cursor.execute(query_router, (
                data.label_router, data.host, data.username_router, 
                data.password_router, data.port, data.latitude, 
                data.longitude, current_id
            ))
            router_id = cursor.lastrowid

            mikrotik_msg = "Sinkronisasi MikroTik berhasil."

            # 2. Coba konek & sinkronkan data RouterOS (Di-isolasi agar tidak menggagalkan simpan Router)
            try:
                connection = routeros_api.RouterOsApiPool(
                    host=data.host,
                    username=data.username_router,
                    password=data.password_router,
                    port=int(data.port) if data.port else 8728,
                    plaintext_login=True,
                )
                api = connection.get_api()

                # 3. Ambil PPP Profile & Simpan ke tbl_paket
                resource_profile = api.get_resource('/ppp/profile')
                profiles_data = resource_profile.get()

                profile_map = {}
                if profiles_data:
                    query_paket = """
                        INSERT INTO tbl_paket (nama_paket, rate_limit, only_one, id_router)
                        VALUES (%s, %s, %s, %s)
                    """
                    for profile in profiles_data:
                        profile_name = profile.get('name')
                        rate_limit = profile.get('rate-limit', None)
                        only_one = profile.get('only-one', 'default')
                        
                        await cursor.execute(query_paket, (
                            profile_name, 
                            rate_limit, 
                            only_one, 
                            router_id
                        ))
                        profile_map[profile_name] = cursor.lastrowid

                # 4. Ambil PPP Secret & Simpan ke tbl_pelanggan
                resource_ppp = api.get_resource('/ppp/secret')
                secrets_data = resource_ppp.get()

                if secrets_data:
                    query_pppoe = """
                        INSERT INTO tbl_pelanggan 
                        (nama_pelanggan, username_pppoe, password_pppoe, id_paket, remote_address, mac_address, id_router)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """
                    
                    pppoe_payload = []
                    for secret in secrets_data:
                        service_type = secret.get('service', 'pppoe')

                        if service_type in ['pppoe', 'any']:
                            secret_name = secret.get('name')
                            secret_profile = secret.get('profile')
                            id_paket = profile_map.get(secret_profile, None)
                            mac_address = secret.get('caller-id', None)

                            pppoe_payload.append((
                                secret_name,
                                secret_name,
                                secret.get('password', ''),
                                id_paket,
                                secret.get('remote-address', None),
                                mac_address,
                                router_id
                            ))

                    if pppoe_payload:
                        await cursor.executemany(query_pppoe, pppoe_payload)

                connection.disconnect()

            except Exception as router_err:
                # Tangkap error koneksi/API MikroTik di sini tanpa melakukan ROLLBACK
                mikrotik_msg = f"Gagal terhubung ke MikroTik ({str(router_err)}). Data paket & PPPoE dilewati."

            # 5. Commit transaksi Database (Data Router tetap tersimpan)
            await conn.commit()

        return {
            "status": "success",
            "message": f"Router berhasil ditambahkan. {mikrotik_msg}",
            "redirect_to": "/admin/routers"
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        await conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan Database/Server: {e}"
        )


# route utuk mengupdate data router
@router.put("/update", response_model=dict, status_code=status.HTTP_200_OK)
async def update_router(
    data: RouterUpdate, 
    id_router: int = Query(..., description="ID Router yang ingin diperbarui"),
    current_id: int = Depends(get_current_perusahaan), 
    conn: Connection = Depends(database_connection)
):
    try:
        async with conn.cursor() as cursor:
            query = """
                UPDATE tbl_router 
                SET label_router=%s, host=%s, username_router=%s, password_router=%s, port=%s, latitude=%s, longitude=%s
                WHERE id_router=%s AND id_perusahaan=%s
            """
            await cursor.execute(query, (
                data.label_router, data.host, data.username_router, 
                data.password_router, data.port, data.latitude, 
                data.longitude, id_router, current_id
            ))
            await conn.commit()

        return {
            "status": "success",
            "message": "Data Router berhasil diperbarui."
        }

    except HTTPException as e:
        print(f"Error: {e}")
        raise e

    except Exception as e:
        await conn.rollback()
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan Database/Server: {e}"
        )

# Route untuk menghapus data router
@router.delete("/delete", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_router(
    id_router: int, 
    current_id: int = Depends(get_current_perusahaan), 
    conn: Connection = Depends(database_connection)
):
    try:
        async with conn.cursor() as cursor:
            # 1. Hapus pelanggan terkait (Hapus tanda *)
            await cursor.execute(
                "DELETE FROM tbl_pelanggan WHERE id_router = %s", 
                (id_router,)
            )
            
            # 2. Hapus paket terkait (Hapus tanda *)
            await cursor.execute(
                "DELETE FROM tbl_paket WHERE id_router = %s", 
                (id_router,)
            )
            
            # 3. Hapus data router utama
            await cursor.execute(
                "DELETE FROM tbl_router WHERE id_router = %s AND id_perusahaan = %s", 
                (id_router, current_id)
            )
            
            # Cek apakah router benar-benar ada dan terhapus
            if cursor.rowcount == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Router tidak ditemukan atau Anda tidak memiliki akses."
                )

            # Simpan perubahan ke database
            await conn.commit()

        return {
            "status": "success",
            "message": "Data Berhasil di Hapus!"
        }

    except HTTPException as e:
        raise e
    
    except Exception as e:
        # Batalkan transaksi jika terjadi kegagalan di tengah jalan
        await conn.rollback()
        print(f"Error Delete Router: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan Server: {e}"
        )


# route untuk menampilkan PPPoE untuk membuat paket,user baru

@router.get("/paket", response_model=dict)
async def get_secret(id_router: int, current_id: int = Depends(get_current_perusahaan), conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT host, username_router, password_router, port FROM tbl_router WHERE id_router = %s AND id_perusahaan = %s", (id_router, current_id))
            router_list = await cursor.fetchone()

            if not router_list:
                return "tidak ada data router di dalam database"
            
            router = RouterConnect(
                host=router_list['host'],
                username_router=router_list['username_router'],
                password_router=router_list['password_router'],
                port=router_list['port']
            )

            profiles = await get_profile(data=router)

            return {
                "status" : "success",
                "data" : profiles
            }

    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )

# menambahkan data profile/paket untuk user bisa memilih

@router.post("/paket/add", response_model=dict)
async def add_secret(data: ProfileCreate, current_id: int = Depends(get_current_perusahaan), conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("INSERT INTO tbl_paket (id_router, id_perusahaan, nama_paket, harga, limits, only_one) VALUES (%s, %s, %s, %s, %s)", (data.id_router, current_id, data.nama_paket, data.harga, data.limits, data.only_one))
            await conn.commit()

            await cursor.execute("SELECT * FROM tbl_router WHERE id_router=%s AND id_perusahaan = %s", (data.id_router, current_id))
            router_list = await cursor.fetchone()

            router = RouterConnect(
                host=router_list['host'],
                username_router=router_list['username_router'],
                password_router=router_list['password_router'],
                port=router_list['port']
            )

            add_paket = await add_profile(data=router, nama_paket=data.nama_paket, limits=data.limits, only_one=data.only_one)

            if not add_paket:
                raise HTTPException("Data gagal Ditambahkan..")

            return {
                "status" : "success",
                "message" : "Data Berhasil ditambahkan!",
                "redirect_to" : "/router/paket"
            }

    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )
    
@router.put("/paket/edit", response_model=dict)
async def edit_paket(data: ProfileCreate, id_profile: int, current_id: int = Depends(get_current_perusahaan), conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("UPDATE tbl_paket SET nama_paket=%s, harga=%s, limits=%s, only_one=%s WHERE id_paket=%s AND id_perusahaan=%s", (data.id_router, data.nama_paket, data.harga, data.limits, data.only_one, id_profile, current_id))
            await conn.commit()

            await cursor.execute("SELECT * FROM tbl_router WHERE id_router=%s AND id_perusahaan=%s", (data.id_router, current_id))
            router_list = await cursor.fetchone()

            router = RouterConnect(
                host=router_list['host'],
                username_router=router_list['username_router'],
                password_router=router_list['password_router'],
                port=router_list['port']
            )

            edit_paket = await edit_profile(data=router, id_profile=id_profile, nama_paket=data.nama_paket, limits=data.limits, only_one=data.only_one)

            if not edit_paket:
                raise HTTPException("Data gagal Diedit..")
            
            return {
                "status" : "success",
                "message" : "Data Berhasil diedit!",
                "redirect_to" : "/router/paket"
            }

    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )
    
# @router.delete('/paket/delete', response_mode=dict)
# async def delete_paket(id_profile: int, current_id: int = Depends(get_current_perusahaan),  conn: Connection = Depends(database_connection)):
#     try:
#         async with conn.cursor() as cursor:
#             await cursor.execute("DELETE FROM tbl_paket WHERE id_paket=%s AND id_perusahaan=%s", (id_profile, current_id))
#             await conn.commit()

#             delete_profile = delete_profile()
