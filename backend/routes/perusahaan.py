from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from config import database_connection, Connection
from backend.utils.security import generate_password_hash, get_current_perusahaan
from backend.schemas.perusahaan_schemas import PerusahaanCreate, PerusahaanUpdate, PerusahaanResponse

router = APIRouter(
    prefix="/api/perusahaan",
    tags=["Perusahaan / Tenant Management"]
    )

# Mengambil profil perusahaan (me)
@router.get("/me")
async def ambil_profil(current_id: int = Depends(get_current_perusahaan), conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT * FROM tbl_perusahaan WHERE id_perusahaan = %s", (current_id,))
            perusahaan = await cursor.fetchone()

            return {
                "status" : "success",
                "data" : perusahaan
            }

    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Menambahkan data perusahaan
@router.post("/add", response_model=dict, status_code=status.HTTP_201_CREATED)
async def add_perusahaan(data: PerusahaanCreate, conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("INSERT INTO tbl_perusahaan (nama_perusahaan, kontak_perusahaan, alamat_perusahaan) VALUES (%s, %s, %s)", (data.nama_perusahaan, data.kontak_perusahaan, data.alamat_perusahaan))
            id_perusahaan = cursor.lastrowid

            password_hashed = generate_password_hash(data.password_perusahaan)

            await cursor.execute("INSERT INTO tbl_user (id_perusahaan, username, email, password) VALUES (%s, %s, %s, %s)", (id_perusahaan, data.nama_perusahaan, data.email_perusahaan, password_hashed))
            await conn.commit()
            
            return {
                "status": "success",
                "message": f"Perusahaan '{data.nama_perusahaan}' berhasil terdaftar!"
            }
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Menampilkan data perusahaan
@router.get("/all", response_model=List[PerusahaanResponse])
async def get_all_perusahaan(conn: Connection = Depends(database_connection)):
    async with conn.cursor() as cursor:
        await cursor.execute("SELECT * FROM tbl_perusahaan ORDER BY id_perusahaan DESC")
        result = await cursor.fetchall()
        return result


# Menampilkan satu data perusahaan berdasarkan id
@router.get("/{id_perusahaan}", response_model=PerusahaanResponse)
async def get_perusahaan_by_id(id_perusahaan: int, conn: Connection = Depends(database_connection)):
    async with conn.cursor() as cursor:
        await cursor.execute("SELECT * FROM tbl_perusahaan WHERE id_perusahaan = %s", (id_perusahaan,))
        perusahaan = await cursor.fetchone()
        
        if not perusahaan:
            raise HTTPException(status_code=404, detail="Perusahaan tidak ditemukan!")
        return perusahaan


# Mengedit data perusahaan berdasarkan id
@router.put("/edit/{id_perusahaan}", response_model=dict)
async def update_perusahaan(id_perusahaan: int, data: PerusahaanUpdate, conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id_perusahaan FROM tbl_perusahaan WHERE id_perusahaan = %s", (id_perusahaan,))
            exist = await cursor.fetchone()
            if not exist:
                raise HTTPException(status_code=404, detail="Perusahaan tidak ditemukan!")

            await cursor.execute("UPDATE tbl_perusahaan SET nama_perusahaan = IFNULL(%s, nama_perusahaan), kontak_perusahaan = IFNULL(%s, kontak_perusahaan), alamat_perusahaan = IFNULL(%s, alamat_perusahaan) WHERE id_perusahaan = %s", (data.nama_perusahaan, data.kontak_perusahaan, data.alamat_perusahaan, id_perusahaan))
            password_hashed = generate_password_hash(data.password_perusahaan)

            await cursor.execute("UPDATE tbl_user SET username = IFNULL(%s, username), email = IFNULL(%s, email), password = IFNULL(%s, password), level = %s WHERE id_perusahaan = %s ", (data.username_perusahaan, data.email_perusahaan, password_hashed, data.level_user, id_perusahaan))
            await conn.commit()

            return {
                "status": "success", 
                "message": "Data perusahaan berhasil diperbarui!"
                }
        
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Menghapus data perusahaan berdasarkan id
@router.delete("/delete/{id_perusahaan}", response_model=dict)
async def delete_perusahaan(id_perusahaan: int, conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT id_perusahaan FROM tbl_perusahaan WHERE id_perusahaan = %s", (id_perusahaan,))
            exist = await cursor.fetchone()
            if not exist:
                raise HTTPException(status_code=404, detail="Perusahaan tidak ditemukan!")

            await cursor.execute("DELETE FROM tbl_invoice WHERE id_perusahaan = %s", (id_perusahaan,))
            await cursor.execute("DELETE FROM tbl_paket WHERE id_perusahaan = %s", (id_perusahaan,))
            await cursor.execute("DELETE FROM tbl_pelanggan WHERE id_perusahaan = %s", (id_perusahaan,))
            await cursor.execute("DELETE FROM tbl_router WHERE id_perusahaan = %s", (id_perusahaan,))
            await cursor.execute("DELETE FROM tbl_user WHERE id_perusahaan = %s", (id_perusahaan,))
            await cursor.execute("DELETE FROM tbl_perusahaan WHERE id_perusahaan = %s", (id_perusahaan,))
            await conn.commit()
            
            return {
                "status": "success", 
                "message": f"Perusahaan dengan ID {id_perusahaan} berhasil dihapus beserta seluruh data routernya!"
                }
        
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))