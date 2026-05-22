from config import database_connection
from fastapi import APIRouter, Depends, HTTPException, status
from backend.schemas.auth_schemas import LoginRequest, LoginResponse, LoginPost
from backend.utils.utils import create_access_token, hash_password, verify_password
from aiomysql import Connection

router = APIRouter(
    tags=["Auth"]
)

@router.post("/api/login", response_model=LoginResponse)
async def login(data: LoginRequest, conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SElECT * FROM tbl_user WHERE email = %s", (data.email,))
            user = await cursor.fetchone()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User tidak Ditemukan!"
            )

        if not user and not verify_password(data.password, user['password']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Username atau Password Salah!"
            )

        payload = {
            "sub" : str(user['username']),
            "level" : str(user['level'])
        }
                
        token = create_access_token(payload)

        return {
            "status" : "success",
            "message" : "Login Berhasil!",
            "token" : token,
            "level" : user['level'],
            "redirect_to" : "/dashboard"
        }
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        print(f"LOG ERROR: {type(e).__name__} - {e}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan: {str(e)}" 
        )

@router.post("/api/register")
async def register(data: LoginPost, conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("INSERT INTO tbl_user (username, email, password) VALUES (%s, %s, %s)", (data.username, data.email, hash_password(data.password)))
            last_id = cursor.lastrowid
            await cursor.execute("INSERT INTO tbl_pelanggan (id_user, nama_pelanggan, no_hp) VALUES (%s, %s, %s)", (last_id, data.username, data.no_hp))
            await conn.commit()

        return {
            "status" : "success",
            "message" : "Register Berhasil!",
            "redirect_to" : "/login"
        }

    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database Error! {e}"
        )

@router.post("/api/logout")
async def logout():
    return {
        "status" : "success",
        "message" : "Sesi telah habis, Token tidak bisa digunakan lagi"
    }