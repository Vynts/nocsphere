from config import database_connection
from fastapi import APIRouter, Depends, HTTPException, status
from aiomysql import Connection
from backend.schemas.user_schemas import UserMain, UserRequest, UserResponse, UserId
from backend.utils.utils import hash_password

router = APIRouter(
    tags=["User"]
)

@router.get("/api/user", response_model=UserResponse)
async def get_user(conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT * FROM tbl_user")
            user_list = await cursor.fetchall()

        return user_list

    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )

@router.post("/api/user/add")
async def add_user(data: UserRequest, conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("INSERT INTO tbl_user (username, email, password) VALUES (%s, %s, %s)", (data.username, data.email, hash_password(data.password)))
            last_id = cursor.lastrowid
            await cursor.execute("INSERT INTO tbl_pelanggan (id_user, nama_pelanggan, no_hp) VALUES (%s, %s, %s)", (last_id, data.username, data.no_hp))
            await conn.commit()

        return {
            "status" : "success",
            "message" : "Data Berhasil di Tambahkan!",
            "redirect_to" : "/user"
        }
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )

@router.put("/api/user/edit")
async def edit_user(data: UserMain, conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("UPDATE tbl_user SET username=%s, email=%s, password=%s WHERE id_user=%s", (data.username, data.email, hash_password(data.password), data.id_user))
            await cursor.execute("UPDATE tbl_pelanggan SET nama_pelanggan=%s, no_hp=%s WHERE id_user=%s", (data.username, data.no_hp, data.id_user))
            await conn.commit()

        return {
            "status" : "success",
            "message" : "Data Berhasil di Edit!",
            "redirect_to" : "/user"
        }
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )

@router.delete("/api/user/delete")
async def delete_user(data: UserId, conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("DELETE FROM tbl_pelanggan WHERE id_user=%s", (data.id_user))
            await cursor.execute("DELETE FROM tbl_user WHERE id_user=%s", (data.id_user))
            await conn.commit()

        return {
            "status" : "success",
            "message" : "Data Berhasil di Edit!",
            "redirect_to" : "/user"
        }
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )