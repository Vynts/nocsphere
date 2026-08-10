from fastapi import APIRouter, Depends, HTTPException, status
from aiomysql import Connection, DictCursor
from config import database_connection
from backend.schemas.dashboard_schemas import DashboardResponse
from backend.utils.security import get_current_perusahaan # Assumed helper auth

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard Management"]
)

@router.get("/me", response_model=DashboardResponse)
async def get_dashboard_data(
    id_perusahaan: int = Depends(get_current_perusahaan),
    conn: Connection = Depends(database_connection)
):
    try:
        async with conn.cursor(DictCursor) as cursor:
            # -------------------------------------------------------------
            # 1. CARDS METRICS
            # -------------------------------------------------------------
            # A. Invoice Paid bulan ini
            await cursor.execute(
                """
                SELECT COUNT(id) AS total FROM tbl_tagihan 
                WHERE id_perusahaan = %s 
                  AND status = 'PAID' 
                  AND MONTH(tgl_bayar) = MONTH(CURRENT_DATE()) 
                  AND YEAR(tgl_bayar) = YEAR(CURRENT_DATE())
                """, (id_perusahaan,)
            )
            paid_count = (await cursor.fetchone())['total']

            # B. Invoice Unpaid bulan ini
            await cursor.execute(
                """
                SELECT COUNT(id) AS total FROM tbl_tagihan 
                WHERE id_perusahaan = %s 
                  AND status = 'UNPAID' 
                  AND MONTH(tgl_jatuh_tempo) = MONTH(CURRENT_DATE()) 
                  AND YEAR(tgl_jatuh_tempo) = YEAR(CURRENT_DATE())
                """, (id_perusahaan,)
            )
            unpaid_count = (await cursor.fetchone())['total']

            # C. User Terisolir
            await cursor.execute(
                """
                SELECT COUNT(id) AS total FROM tbl_pelanggan 
                WHERE id_perusahaan = %s AND status_koneksi = 'ISOLATED'
                """, (id_perusahaan,)
            )
            isolated_count = (await cursor.fetchone())['total']

            # D. PPPoE User Down (Offline / Disconnected)
            await cursor.execute(
                """
                SELECT COUNT(id) AS total FROM tbl_pelanggan 
                WHERE id_perusahaan = %s AND status_koneksi = 'DOWN'
                """, (id_perusahaan,)
            )
            down_count = (await cursor.fetchone())['total']


            # -------------------------------------------------------------
            # 2. TABEL ROUTER (ACTIVE & OFFLINE)
            # -------------------------------------------------------------
            await cursor.execute(
                """
                SELECT id, nama_router, ip_address, status, last_seen 
                FROM tbl_router 
                WHERE id_perusahaan = %s
                ORDER BY status DESC, nama_router ASC
                """, (id_perusahaan,)
            )
            routers_list = await cursor.fetchall()


            # -------------------------------------------------------------
            # 3. TABEL INVOICE TERBARU (5 Terakhir)
            # -------------------------------------------------------------
            await cursor.execute(
                """
                SELECT t.id, t.order_id, p.nama_pelanggan, t.total_bayar, t.status, t.tgl_jatuh_tempo
                FROM tbl_tagihan t
                JOIN tbl_pelanggan p ON t.id_pelanggan = p.id
                WHERE t.id_perusahaan = %s
                ORDER BY t.created_at DESC
                LIMIT 5
                """, (id_perusahaan,)
            )
            invoices_list = await cursor.fetchall()


            # -------------------------------------------------------------
            # 4. PROFIL PERUSAHAAN
            # -------------------------------------------------------------
            await cursor.execute(
                """
                SELECT id, nama_perusahaan, kontak_perusahaan, alamat_perusahaan, tipe_lisensi 
                FROM tbl_perusahaan 
                WHERE id = %s
                """, (id_perusahaan,)
            )
            perusahaan_info = await cursor.fetchone()

            if not perusahaan_info:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="Data perusahaan tidak ditemukan!"
                )

        # Build Response Data
        return {
            "status": "success",
            "cards": {
                "invoice_paid_this_month": paid_count,
                "invoice_unpaid_this_month": unpaid_count,
                "total_users_isolated": isolated_count,
                "pppoe_users_down": down_count
            },
            "routers": routers_list,
            "recent_invoices": invoices_list,
            "perusahaan": perusahaan_info
        }

    except Exception as e:
        print(f"ERROR DASHBOARD: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal mengambil data dashboard: {str(e)}"
        )