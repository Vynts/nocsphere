from config import database_connection
from fastapi import APIRouter, Depends, HTTPException, status
from backend.schemas.auth_schemas import LoginRequest, TokenResponse
from backend.schemas.perusahaan_schemas import PerusahaanCreate
from backend.utils.security import create_access_token, generate_password_hash, verify_password
from aiomysql import Connection

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth Management"]
)

@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id_perusahaan, password, level FROM tbl_user WHERE email = %s", (payload.email,))
            perusahaan = await cursor.fetchone()

        if not perusahaan:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User tidak Ditemukan!"
            )
        
        id_perusahaan = perusahaan['id_perusahaan']

        if not perusahaan and not verify_password(payload.password, perusahaan['password']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Username atau Password Salah!"
            )

        access_token = create_access_token(data={"id_perusahaan": id_perusahaan})

        return {
            "status" : "success",
            "message" : "Login Berhasil!",
            "access_token" : access_token,
            "token_type": "bearer",
            "level" : perusahaan['level'],
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

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(data: PerusahaanCreate, conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("INSERT INTO tbl_perusahaan (nama_perusahaan, kontak_perusahaan, alamat_perusahaan) VALUES (%s, %s, %s)", (data.nama_perusahaan, data.kontak_perusahaan, data.alamat_perusahaan))
            id_perusahaan = cursor.lastrowid
            password_hashed = generate_password_hash(data.password_perusahaan)

            await cursor.execute("INSERT INTO tbl_user (id_perusahaan, username, email, password) VALUES (%s, %s, %s, %s)", (id_perusahaan, data.username_perusahaan, data.email_perusahaan, password_hashed))
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

@router.post("/logout")
async def logout():
    return {
        "status" : "success",
        "message" : "Sesi telah habis, Token tidak bisa digunakan lagi"
    }