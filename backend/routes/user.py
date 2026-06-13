from config import database_connection
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException, status
from aiomysql import Connection
from backend.schemas.user_schemas import UserMain, UserRequest, UserResponse, UserId
from backend.utils.security import hash_password, get_current_perusahaan
import asyncio

router = APIRouter(
    prefix="/api/user",
    tags=["User Management"]
)

@router.get("/api/user", response_model=dict)
async def get_user(current_id: int = Depends(get_current_perusahaan), conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT * FROM tbl_user WHERE id_perusahaan = %s", (current_id,))
            user_list = await cursor.fetchall()

        return {
            "status" : "success",
            "data" : user_list 
        }

    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )

@router.post("/api/user/add", response_model=dict)
async def add_user(data: UserRequest, current_id: int = Depends(get_current_perusahaan), conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("INSERT INTO tbl_pelanggan (id_perusahaan, id_router, id_paket, nama_pelanggan, username_pppoe, password_pppoe, username_aplikasi, password_aplikasi, no_hp, mac_pelanggan, ip_remote, status, latitude, longitude) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", ())
            await conn.commit()

        return {
            "status" : "success",
            "message" : "Data Berhasil di Tambahkan!",
            "redirect_to" : "/user"
        }
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )

# @router.put("/api/user/edit")
# async def edit_user(data: UserMain, conn : Connection = Depends(database_connection)):
#     try:
#         async with conn.cursor() as cursor:
#             await cursor.execute("UPDATE tbl_user SET username=%s, email=%s, password=%s WHERE id_user=%s", (data.username, data.email, hash_password(data.password), data.id_user))
#             await cursor.execute("UPDATE tbl_pelanggan SET nama_pelanggan=%s, no_hp=%s WHERE id_user=%s", (data.username, data.no_hp, data.id_user))
#             await conn.commit()

#         return {
#             "status" : "success",
#             "message" : "Data Berhasil di Edit!",
#             "redirect_to" : "/user"
#         }
    
#     except HTTPException as e:
#         raise e
    
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Terjadi Kesalahan! {e}"
#         )

# @router.delete("/api/user/delete")
# async def delete_user(data: UserId, conn : Connection = Depends(database_connection)):
#     try:
#         async with conn.cursor() as cursor:
#             await cursor.execute("DELETE FROM tbl_pelanggan WHERE id_user=%s", (data.id_user))
#             await cursor.execute("DELETE FROM tbl_user WHERE id_user=%s", (data.id_user))
#             await conn.commit()

#         return {
#             "status" : "success",
#             "message" : "Data Berhasil di Edit!",
#             "redirect_to" : "/user"
#         }
    
#     except HTTPException as e:
#         raise e
    
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Terjadi Kesalahan! {e}"
#         )
    
# @router.websocket("/api/pelanggan")
# async def get_customer(websocket: WebSocket, conn : Connection = Depends(database_connection)):
#     await websocket.accept()
#     try:
#         async with conn.cursor() as cursor:
#             await cursor.execute("SELECT * FROM tbl_pelanggan")
#             db_customer = await cursor.fetchall()

#             await cursor.execute("SELECT * FROM tbl_router")
#             mikrotik_list = await cursor.fetchall()

#             while True:
#                 mikrotik_user = await get_customer_data(data=mikrotik_list)

#                 online_list = any(m['mac'] == db_customer['mac_address'] for m in mikrotik_user)

#                 active_user = []
#                 for row in db_customer:
#                     active_user.append({
#                             "username" : row['username'],
#                             "no_hp" : row['no_hp'],
#                             "lng" : row['lng'],
#                             "lat" : row['lat'],
#                             "status" : "online" if online_list else "offline"
#                     })

#                 await websocket.send_json({
#                     "status" : "success",
#                     "total_online" : len(online_list),
#                     "data" : active_user
#                 })

#                 await asyncio.sleep(15)

#     except WebSocketDisconnect as e:
#         raise e
    
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Terjadi Kesalahan! {e}"
#         )
    
#     finally:
#         try:
#             await websocket.close()
#         except:
#             pass