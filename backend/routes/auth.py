import os
import httpx
import urllib.parse
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import RedirectResponse
from aiomysql import Connection, DictCursor
from config import database_connection

from backend.schemas.auth_schemas import LoginRequest, TokenResponse
from backend.schemas.perusahaan_schemas import PerusahaanCreate
from backend.utils.security import create_access_token, generate_password_hash, verify_password

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth Management"]
)

# --- KONFIGURASI ENV ---
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "YOUR_GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback")
CLOUDFLARE_TURNSTILE_SECRET = os.getenv("CF_TURNSTILE_SECRET", "YOUR_TURNSTILE_SECRET_KEY")


# --- HELPER VERIFIKASI CLOUDFLARE TURNSTILE ---
async def verify_cloudflare_turnstile(token: str) -> bool:
    """Mengirim request ke Cloudflare untuk memverifikasi token CAPTCHA."""
    url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    payload = {
        "secret": CLOUDFLARE_TURNSTILE_SECRET,
        "response": token
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(url, data=payload)
        result = res.json()
        return result.get("success", False)


# --- 1. ENDPOINT LOGIN REGULER + VERIFIKASI CLOUDFLARE ---
@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest, 
    cf_turnstile_token: str = Query(..., description="Token CAPTCHA dari Cloudflare Turnstile"),
    conn: Connection = Depends(database_connection)
):
    # Step A: Verifikasi Turnstile Token
    is_human = await verify_cloudflare_turnstile(cf_turnstile_token)
    if not is_human:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verifikasi Cloudflare Turnstile gagal! Terdeteksi sebagai Bot."
        )

    try:
        # Step B: Query User dengan DictCursor
        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute(
                "SELECT id_perusahaan, tenant_slug, password, level FROM tbl_user WHERE email = %s", 
                (payload.email,)
            )
            perusahaan = await cursor.fetchone()

        # Step C: Validasi User dan Password (DIPERBAIKI)
        if not perusahaan or not verify_password(payload.password, perusahaan['password']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau Password Salah!"
            )

        # Step D: Buat JWT Access Token
        access_token = create_access_token(data={"id_perusahaan": perusahaan['id_perusahaan']})

        return {
            "status": "success",
            "message": "Login Berhasil!",
            "access_token": access_token,
            "token_type": "bearer",
            "level": perusahaan['level'],
            "tenant": perusahaan['tenant_slug'],
            "redirect_to": "/dashboard"
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"LOG ERROR: {type(e).__name__} - {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan: {str(e)}"
        )


# --- 2. ENDPOINT GOOGLE OAUTH2 ---
@router.get("/google/login")
async def google_login(cf_turnstile_token: str = Query(...)):
    """
    Memvalidasi Turnstile lalu Redirect pengguna ke halaman Login Google.
    """
    is_human = await verify_cloudflare_turnstile(cf_turnstile_token)
    if not is_human:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Verifikasi Turnstile gagal."
        )

    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"response_type=code&client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_REDIRECT_URI}&scope=openid%20email%20profile"
    )
    return RedirectResponse(url=google_auth_url)


@router.get("/google/callback")
async def google_callback(code: str, conn: Connection = Depends(database_connection)):
    # 1. Tukar Code dengan Access Token Google
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    async with httpx.AsyncClient() as client:
        token_res = await client.post(token_url, data=data)
        token_json = token_res.json()

        if "access_token" not in token_json:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Gagal otentikasi Google")

        # 2. Ambil Profil User dari Google
        user_info_res = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {token_json['access_token']}"}
        )
        google_user = user_info_res.json()

    email = google_user.get("email")
    google_id = google_user.get("id")
    nama_lengkap = google_user.get("name", "")

    try:
        async with conn.cursor(DictCursor) as cursor:
            # 3. Cek apakah Email sudah terdaftar di tbl_user
            await cursor.execute(
                "SELECT id_perusahaan, tenant_slug, level FROM tbl_user WHERE email = %s", 
                (email,)
            )
            user = await cursor.fetchone()

            # --- SKENARIO 1: USER BELUM TERDAFTAR (TELEPORT KE REGISTRASI) ---
            if not user:
                # Mengembalikan flag 'is_registered': False agar Frontend bisa
                front_end_url = "http://localhost:3000/register"  #
                # mengarahkan (teleport) user ke form registrasi perusahaan.
                query_params = urllib.parse.urlencode({ 
                    "status": "pending_registration",
                    "message": "Akun belum terdaftar. Silakan lengkapi pendaftaran perusahaan Anda.",
                    "is_registered": False,
                    "google_data": {
                        "email": email,
                        "nama": nama_lengkap,
                        "google_id": google_id
                    }
                })
                return RedirectResponse(url=f"{front_end_url}?{query_params}")

            # Optional: Update google_id jika user dulu register manual (bukan via Google)
            await cursor.execute(
                "UPDATE tbl_user SET google_id = %s WHERE email = %s AND google_id IS NULL",
                (google_id, email)
            )
            await conn.commit()

        # --- SKENARIO 2: USER SUDAH TERDAFTAR (LOGIN BERHASIL) ---
        access_token = create_access_token(data={"id_perusahaan": user['id_perusahaan']})

        return {
            "status": "success",
            "message": "Login Google Berhasil!",
            "is_registered": True,
            "access_token": access_token,
            "token_type": "bearer",
            "level": user['level'],
            "tenant": user['tenant_slug'],
            "redirect_to": "/dashboard"
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal memproses login Google: {str(e)}"
        )

# --- 3. REGISTER & LOGOUT (DIPERBAIKI) ---
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(data: PerusahaanCreate, conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(
                "INSERT INTO tbl_perusahaan (nama_perusahaan, kontak_perusahaan, alamat_perusahaan) VALUES (%s, %s, %s)", 
                (data.nama_perusahaan, data.kontak_perusahaan, data.alamat_perusahaan)
            )
            id_perusahaan = cursor.lastrowid
            password_hashed = generate_password_hash(data.password_perusahaan)

            await cursor.execute(
                "INSERT INTO tbl_user (id_perusahaan, username, email, password) VALUES (%s, %s, %s, %s)", 
                (id_perusahaan, data.username_perusahaan, data.email_perusahaan, password_hashed)
            )
            await conn.commit()

        return {
            "status": "success",
            "message": "Register Berhasil!",
            "redirect_to": "/login"
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
        "status": "success",
        "message": "Sesi telah habis, Token tidak bisa digunakan lagi"
    }