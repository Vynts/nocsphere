import httpx
from fastapi import APIRouter, Request, HTTPException
from backend.schemas.telegram_schemas import NetwatchPayload

router = APIRouter(
    prefix='/api/bot-telegram',
    tags=["Bot Telegram"])

async def send_telegram_message(bot_token: str, chat_id: str, message: str):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {"chat_id": chat_id, "text": message, "parse_mode": "HTML"}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error sending Telegram message: {e}")
            return None


@router.post("/netwatch")
async def netwatch_webhook(payload: NetwatchPayload):
    status_upper = payload.status.upper()

    if status_upper == "UP":
        emoji = "🟢"
        status_text = "<b>UP / RECONNECTED</b>"
    else:
        emoji = "🔴"
        status_text = "<b>DOWN / DISCONNECTED</b>"

    text = (
        f"{emoji} <b>NETWATCH ALERT</b>\n\n"
        f"<b>Router:</b> {payload.router}\n"
        f"<b>Host:</b> {payload.host}\n"
        f"<b>Status:</b> {status_text}\n"
    )

    # Kirim ke bot_token & chat_id milik perusahaan yang bersangkutan
    result = await send_telegram_message(
        payload.bot_token, payload.chat_id, text
    )

    if not result:
        raise HTTPException(
            status_code=500, detail="Failed to send Telegram notification"
        )

    return {"status": "success", "message": "Notification sent"}
