from config import database_connection
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from backend.schemas.router_schemas import RouterCreate, RouterResponse, RouterUpdate, RouterConnect, ProfileCreate
from backend.utils.security import generate_password_hash, check_password_hash, get_current_perusahaan
from backend.utils.routers import get_active, get_profile, get_secret, add_profile, connect_to_router
from aiomysql import Connection
import asyncio

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

@router.get("/list", response_model=RouterResponse)
async def get_router(current_id: int = Depends(get_current_perusahaan), conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:

            await cursor.execute("SELECT * FROM tbl_router ORDER BY desc WHERE id_perusahaan = %s", (current_id))
            mikrotik_list = await cursor.fetchall()

        return mikrotik_list
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database Error! {e}"
        )
    

# Route untuk menambahkan data router

@router.post("/add", response_model=dict, status_code=status.HTTP_201_CREATED)
async def add_router(data : RouterCreate, current_id: int = Depends(get_current_perusahaan), conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("INSERT INTO tbl_router (label_router, host, username_router, password_router, port, id_perusahaan) VALUES (%s, %s, %s, %s, %s, %s)", (data.label_router, data.host, data.username_router, data.password_router, data.port, current_id))
            await conn.commit()

        return {
            "status" : "success",
            "message" : "Data Berhasil di Tambahkan!",
            "redirect_to" : "/router"
        }
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )


# Route untuk mengedit dan mengupdate data router

@router.put("/edit", response_model=dict, status_code=status.HTTP_200_OK)
async def edit_router(data : RouterUpdate, current_id: int = Depends(get_current_perusahaan), conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("UPDATE tbl_router SET label_router=%s, host=%s, username_router=%s, password_router=%s, port=%s WHERE id_router=%s AND id_perusahaan = %s", (data.label_router, data.host, data.username_router, data.password_router, data.port, data.id_router, current_id))
            await conn.commit()

        return {
            "status" : "success",
            "message" : "Data Berhasil di Edit!",
            "redirect_to" : "/router"
        }
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
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
    
# @router.put("/api/router/paket/edit")
# async def edit_paket(data: SecretMain, conn : Connection = Depends(database_connection)):
#     try:
#         async with conn.cursor() as cursor:
#             await cursor.execute("UPDATE tbl_paket SET id_router=%s, nama_paket=%s, harga=%s, limits=%s, only_one=%s WHERE id_paket=%s", (data.id_router, data.nama_paket, data.harga, data.limits, data.only_one, data.id_paket))
#             await conn.commit()


