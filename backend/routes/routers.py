import asyncio
from typing import List
from config import database_connection
import routeros_api
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from backend.schemas.router_schemas import RouterCreate, RouterResponse, RouterUpdate, RouterConnect, ProfileCreate
from backend.utils.security import generate_password_hash, check_password_hash, get_current_perusahaan
from backend.utils.routers import get_active, get_profile, get_secret, add_profile, edit_profile, delete_profile, connect_to_router, check_router_status, get_single_router_bandwidth, _fetch_routeros_traffic
from aiomysql import Connection

router = APIRouter( 
    prefix="/api/router",
    tags=["Router Management"]
)

# route untuk melihat data router yang akan dipakai sebagai penggambilan data

@router.get("")
async def get_router_by_id(id_router: int, current_id: int = Depends(get_current_perusahaan), conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT * FROM tbl_router WHERE id_router = %s AND id_perusahaan = %s", (id_router, current_id))
            router_list = await cursor.fetchone()

            router = RouterConnect(
                host=router_list['host'],
                username_router=router_list['username_router'],
                password_router=router_list['password_router'],
                port=router_list['port']
            )

            connection = connect_to_router(data=router)

            return connection

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database Error! {e}"
        )

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
        print(f"[Backend Error /list]: {e}")  # Cek terminal FastAPI untuk log detail
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

        print(f"[Backend /bandwidth/avg] Total Routers: {total_routers}, Online: {total_online}, Avg Download: {avg_download} kbps, Avg Upload: {avg_upload} kbps")

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
        print(f"[Backend Error /bandwidth/avg]: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menghitung statistik bandwidth: {e}"
        )
    

# Route untuk menambahkan data router
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

            # 2. Connect ke RouterOS via API
            try:
                connection = routeros_api.RouterOsApiPool(
                    host=data.host,
                    username=data.username_router,
                    password=data.password_router,
                    port=int(data.port) if data.port else 8728,
                    timeout=10
                )
                api = connection.get_api()

                # ----------------------------------------------------
                # 3. Ambil PPP Profile & Simpan ke tbl_paket
                # ----------------------------------------------------
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
                        rate_limit = profile.get('rate-limit', None)  # Menangkap nilai misal "10M/10M"
                        only_one = profile.get('only-one', 'default')  # Menangkap "yes", "no", atau "default"
                        
                        await cursor.execute(query_paket, (
                            profile_name, 
                            rate_limit, 
                            only_one, 
                            router_id
                        ))
                        profile_map[profile_name] = cursor.lastrowid

                # ----------------------------------------------------
                # 4. Ambil PPP Secret & Match dengan id_paket ke tbl_pelanggan
                # ----------------------------------------------------
                resource_ppp = api.get_resource('/ppp/secret')
                secrets_data = resource_ppp.get()

                if secrets_data:
                    query_pppoe = """
                        INSERT INTO tbl_pelanggan 
                        (nama_pelanggan, username_pppoe, password_pppoe, service, id_paket, remote_address, id_router)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """
                    
                    pppoe_payload = []
                    for secret in secrets_data:
                        secret_name = secret.get('name')
                        secret_profile = secret.get('profile')

                        id_paket = profile_map.get(secret_profile, None)

                        pppoe_payload.append((
                            secret_name,                          # nama_pelanggan
                            secret_name,                          # username_pppoe
                            secret.get('password', ''),           # password_pppoe
                            secret.get('service', 'pppoe'),       # service
                            id_paket,                             # id_paket (Foreign Key ke tbl_paket)
                            secret.get('remote-address', None),   # remote_address
                            router_id,                            # id_router
                        ))

                    await cursor.executemany(query_pppoe, pppoe_payload)

                connection.disconnect()

            except Exception as router_err:
                # Rollback jika gagal terkoneksi atau gagal memproses data MikroTik
                await conn.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Gagal terhubung/sinkronisasi dengan RouterOS API: {str(router_err)}"
                )

            # 5. Commit semua transaksi jika berhasil
            await conn.commit()

        return {
            "status": "success",
            "message": "Router, Paket, & Data PPPoE Berhasil Ditambahkan!",
            "redirect_to": "/router"
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        await conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan Server! {e}"
        )

# Route untuk menghapus data router

@router.delete("/delete", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_router(data: int, current_id: int = Depends(get_current_perusahaan), conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("DELETE FROM tbl_router WHERE id_router=%s AND id_perusahaan = %s", (data, current_id))
            await conn.commit()

        return {
            "status" : "success",
            "message" : "Data Berhasil di Hapus!",
            "redirect_to" : "/router"
        }

    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
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
