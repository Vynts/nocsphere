from pydantic import BaseModel, Field
from typing import Optional

class LoginPost(BaseModel):
    username: str = Field(..., example="PT-NOCSPHERE")
    email: str = Field(..., example="nocsphere@gmail.com")
    password: str = Field(..., example="password123")
    no_hp: str = Field(None, example="081234567890")

class LoginRequest(BaseModel):
    email: str = Field(..., example="nocsphere@gmail.com")
    password: str = Field(..., example="password123")

class TokenResponse(BaseModel):
    status: str
    message: str
    access_token: str
    level: str
    token_type: str = "bearer"
    redirect_to: str = Field(..., example="/dashboard")