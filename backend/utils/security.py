import os
import jwt
import datetime
import routeros_api
from aiomysql import Connection
from dotenv import load_dotenv
from fastapi import Depends, status, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from werkzeug.security import generate_password_hash, check_password_hash
from config import database_connection

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRED = 1440

securiry_bearer = HTTPBearer()

def verify_password(password: str, hash_password):
    if not hash_password or not password:
        return False
    return check_password_hash(hash_password, password)

# generate password menjadi hashed password
def hash_password(password: str):
    return generate_password_hash(password)

# membuat token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRED)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_perusahaan(credentials: HTTPAuthorizationCredentials = Depends(securiry_bearer)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_perusahaan: int = payload.get("id_perusahaan")
        
        if id_perusahaan is None:
            raise "tidak ada data perusahaan"
            
        return id_perusahaan
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token login sudah kedaluwarsa, silakan login ulang!"
        )
    except jwt.InvalidTokenError:
        raise "invalid"
