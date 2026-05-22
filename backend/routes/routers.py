from config import database_connection
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from backend.schemas.router_schemas import RouterMain, RouterRequest, RouterId
from backend.utils.utils import get_customer_data, get_pppoe_data, get_paket_data
from aiomysql import Connection
import asyncio

router = APIRouter( 
    tags=["Router"]
)

@router.get("/api/router", response_model=RouterMain)
async def get_router(conn: Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:

            await cursor.execute("SELECT * FROM tbl_router")
            mikrotik_list = await cursor.fetchall()

        return mikrotik_list
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database Error! {e}"
        )

@router.post("/api/router/add")
async def add_router(data : RouterRequest ,conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("INSERT INTO tbl_router (label_router, host, username_router, password_router, port) VALUES (%s, %s, %s, %s, %s)", (data.label_router, data.host, data.username_router, data.password_router, data.port))
            await conn.commit()

        return {
            "status" : "success",
            "message" : "Data Berhasil di Tambahkan!",
            "redirect_to" : "/router"
        }
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )

@router.put("/api/router/edit")
async def edit_router(data : RouterMain, conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("UPDATE tbl_router SET nama_router=%s, host=%s, username_router=%s, password_router=%s, port=%s WHERE id_router=%s", (data.nama_router, data.host, data.username_router, data.password_router, data.port, data.id_router))
            await conn.commit()

        return {
            "status" : "success",
            "message" : "Data Berhasil di Edit!",
            "redirect_to" : "/router"
        }
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )


@router.delete("/api/router/delete")
async def delete_router(data: RouterId, conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("DELETE FROM tbl_router WHERE id_router=%s", (data.id_router))
            await conn.commit()

        return {
            "status" : "success",
            "message" : "Data Berhasil di Hapus!",
            "redirect_to" : "/router"
        }

    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )

@router.websocket("/api/router/pelanggan")
async def get_customer(websocket: WebSocket, conn : Connection = Depends(database_connection)):
    await websocket.accept()
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT * FROM tbl_pelanggan")
            db_customer = await cursor.fetchall()

            await cursor.execute("SELECT * FROM tbl_router")
            mikrotik_list = await cursor.fetchall()

            while True:
                mikrotik_user = await get_customer_data(data=mikrotik_list)

                online_list = any(m['mac'] == db_customer['mac_address'] for m in mikrotik_user)

                active_user = []
                for row in db_customer:
                    active_user.append({
                            "username" : row['username'],
                            "no_hp" : row['no_hp'],
                            "lng" : row['lng'],
                            "lat" : row['lat'],
                            "status" : "online" if online_list else "offline"
                    })

                await websocket.send_json({
                    "status" : "success",
                    "total_online" : len(online_list),
                    "data" : active_user
                })

                await asyncio.sleep(15)

    except WebSocketDisconnect as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )
    
    finally:
        try:
            await websocket.close()
        except:
            pass


@router.websocket("/api/router/paket")
async def get_secret(websocket : WebSocket, conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor() as cursor:
            await conn.execute("SELECT * FROM tbl_paket")
            data_paket = await cursor.fetchall()

    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi Kesalahan! {e}"
        )
    
    finally:
        await websocket.close()


@router.websocket("/api/router/pppoe")
async def get_pppoe(websocket : WebSocket, conn : Connection = Depends(database_connection)):
    try:
        async with conn.cursor as cursor:
            await cursor.execute("SELECT * FROM tbl_pppoe")
            data_pppoe = await cursor.fetchall()

            while True:
                mikrotik_pppoe = await get_pppoe_data()

                pppoe_list = any(m['username'] == data_pppoe['username'] for m in mikrotik_pppoe)

                pppoe = []
                for row in data_pppoe:
                    pppoe.append({
                        "username" : row['username'],
                        
                    })

    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise Exception(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = f"Terjadi Kesalahan! {e}"
        )
    
    finally:
        await websocket.close()