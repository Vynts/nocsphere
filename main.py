from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import auth, user, invoice, routers, dashboard, perusahaan
# from backend.utils.routers import add_data_pelanggan
from contextlib import asynccontextmanager
from config import database_connection
from dotenv import load_dotenv

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     try:
#         async for conn in database_connection():
#             await add_data_pelanggan(conn=conn)
#             break

#     except Exception as e:
#         print(f"[STARTUP ERROR] Gagal menjalankan sinkronisasi awal: {e}")
    
#     yield
#     print("[SHUTDOWN] Server dimatikan, membersihkan koneksi...")

load_dotenv()
app = FastAPI()

@app.get("/")
async def root():
    return {"status": "running", "message": "Sistem Monitoring PPPoE Multi-Router Aktif!"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register blueprint app
app.include_router(auth.router)
app.include_router(routers.router)
# app.include_router(user.router)
app.include_router(invoice.router)
app.include_router(perusahaan.router)
# app.include_router(dashboard.router)

