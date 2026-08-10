from pydantic import BaseModel, Field
from typing import Optional

class NetwatchPayload(BaseModel):
    host: str
    status: str
    router: str
    bot_token: str
    chat_id: str