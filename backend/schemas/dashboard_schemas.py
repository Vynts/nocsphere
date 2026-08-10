from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- CARD METRICS SCHEMAS ---
class DashboardCards(BaseModel):
    invoice_paid_this_month: int
    invoice_unpaid_this_month: int
    total_users_isolated: int
    pppoe_users_down: int

# --- ROUTER TABLE SCHEMA ---
class RouterStatus(BaseModel):
    id: int
    nama_router: str
    ip_address: str
    status: str  # 'ONLINE' atau 'OFFLINE'
    last_seen: Optional[datetime] = None

# --- RECENT INVOICE SCHEMA ---
class RecentInvoice(BaseModel):
    id: int
    order_id: str
    nama_pelanggan: str
    total_bayar: float
    status: str  # 'PAID', 'UNPAID', 'EXPIRED'
    tgl_jatuh_tempo: datetime

# --- PERUSAHAAN PROFILE SCHEMA ---
class PerusahaanProfile(BaseModel):
    id: int
    nama_perusahaan: str
    kontak_perusahaan: Optional[str] = None
    alamat_perusahaan: Optional[str] = None
    tipe_lisensi: str  # 'SUBSCRIPTION' / 'LIFETIME'

# --- COMBINED DASHBOARD RESPONSE ---
class DashboardResponse(BaseModel):
    status: str
    cards: DashboardCards
    routers: List[RouterStatus]
    recent_invoices: List[RecentInvoice]
    perusahaan: PerusahaanProfile