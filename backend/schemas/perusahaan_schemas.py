from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Data yang dikirim dari Front-End saat mendaftarkan perusahaan baru
class PerusahaanCreate(BaseModel):
    nama_perusahaan: str = Field(..., example="Noctree Media Nusantara")
    kontak_perusahaan: Optional[str] = Field(None, example="081234567890")
    alamat_perusahaan: Optional[str] = Field(None, example="Jl. Utama No. 12, Bandar Lampung")
    username_perusahaan: str = Field(..., example="PT. NOCSPHERE") 
    email_perusahaan: str = Field(..., example="nocsphere@gmail.com")
    password_perusahaan: str = Field(..., example="password123")

# Data yang dikirim saat mengedit/update perusahaan
class PerusahaanUpdate(BaseModel):
    nama_perusahaan: Optional[str] = Field(None, example="Noctree Media Nusantara v2")
    kontak_perusahaan: Optional[str] = Field(None, example="08999999999")
    alamat_perusahaan: Optional[str] = Field(None, example="Alamat Baru, Bandar Lampung")
    username_perusahaan: Optional[str] = Field(None, example="PT. NOCSPHERE") 
    email_perusahaan: Optional[str] = Field(None, example="nocsphere@gmail.com")
    password_perusahaan: Optional[str] = Field(None, example="password123")
    level_user: Optional[str] = Field(None, example="teknisi, admin, superadmin")

# Struktur data yang dikembalikan sebagai response API
class PerusahaanResponse(BaseModel):
    id_perusahaan: int
    nama_perusahaan: str
    kontak_perusahaan: Optional[str]
    alamat_perusahaan: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True