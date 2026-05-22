import os
import jwt
import datetime
import routeros_api
from dotenv import load_dotenv
from backend.schemas.router_schemas import RouterConnect
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"

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
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# mengambil data dari router
def get_customer_data(data: RouterConnect):
    try:
        connection = routeros_api.RouterOsApiPool(
            data.host,
            username = data.username_router,
            password = data.password_router,
            port = data.port,
            plaintext_login=True
        )   
        api = connection.get_api()
        dhcp = api.get_resource('/ip/dhcp-server/lease').get()

        connection.disconnect()

        return dhcp
    
    except Exception as e:
        raise e

def get_paket_data(data : RouterConnect):
    try:
        connection = routeros_api.RouterOsApiPool(
            data.host,
            username = data.username_router,
            password = data.password_router,
            port = data.port,
            plaintext_login=True
        )   
        api = connection.get_api()
        secrets = api.get_resource("/ppp/secrets").get()

        connection.disconnect()
        return secrets

    except Exception as e:
        raise e
    
def get_pppoe_data(data : RouterConnect):
    try:
        connection = routeros_api.RouterOsApiPool(
            data.host,
            username = data.username_router,
            password = data.password_router,
            port = data.port,
            plaintext_login=True
        )   
        api = connection.get_api()
        pppoe = api.get_resource("/ppp/pppoe").get()

        connection.disconnect()
        return pppoe
    
    except Exception as e:
        raise e