from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Schema Router yang digunakan untuk mengkoneksikan router
class RouterConnect(BaseModel):
    host: str = Field(..., examples="127.0.0.1")
    username_router: str = Field(..., example="admin")
    password_router: str = Field(..., example="password123")
    port: Optional[int] = Field(default=8728, example="8728")

# Schema Router yang digunakan untuk menambahkan data Router ke Database
class RouterCreate(BaseModel):
    label_router: str = Field(..., example="MikroTik-NocSphere")
    host: str = Field(..., example="192.168.88.1")
    username_router: str = Field(..., example="admin")
    password_router: str = Field(..., example="password123")
    port: int = Field(8728, example=8728)
    latitude: Optional[str] = Field(None, example="-5.3971")
    longitude: Optional[str] = Field(None, example="105.2668")

# Schema Router yang digunakan sebagai keluarnya data dan akan diberikan ke Front-End
class RouterResponse(BaseModel):
    id_router: int
    id_perusahaan: int
    label_router: str  # Disesuaikan dari nama_router
    host: str          # Disesuaikan dari ip_address
    username_router: str
    port: int
    status: Optional[str] = "offline"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

# Schema Router untuk menngedit data yang mau diedit di dalam database
class RouterUpdate(BaseModel):
    id_router: int
    host: Optional[str] = Field(None, example="192.168.88.1")
    label_router: Optional[str] = Field(None , example="Mikrotik1")
    username_router: Optional[str] = Field(None, example="admin")
    password_router: Optional[str] = Field(None, example="password123")
    port: Optional[int] = Field(None, example=8728)
    latitude: Optional[str] = Field(None, example="-5.3971")
    longitude: Optional[str] = Field(None, example="105.2668")

class ProfileCreate(BaseModel):
    id_router: int = Field(..., example=1)
    nama_paket: str = Field(..., example="paket-10mbs")
    harga: int = Field(..., example="150000")
    limits: str = Field(..., example="10M/10M")
    only_one: str = Field(..., example="yes") 