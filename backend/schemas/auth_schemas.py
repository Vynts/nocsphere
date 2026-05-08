from pydantic import BaseModel

class LoginPost(BaseModel):
    username: str
    email: str
    password: str
    no_hp: str | None = None

class LoginRequest(BaseModel):
    email: str
    password: str 

class LoginResponse(BaseModel):
    status: str
    message: str
    token: str | None = None
    level: str | None = None
    redirect_to: str | None = None