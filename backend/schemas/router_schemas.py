from pydantic import BaseModel

class RouterConnect(BaseModel):
    host: str
    username_router: str
    password_router: str
    port: int = 8728

class RouterMain(BaseModel):
    id_router: int
    nama_router: str
    host: str
    username_router: str
    password_router: str
    port: int = 8728

class RouterRequest(BaseModel):
    label_router: str
    host: str
    username_router: str
    password_router: str
    port: int = 8728

class RouterId(BaseModel):
    id_router: int