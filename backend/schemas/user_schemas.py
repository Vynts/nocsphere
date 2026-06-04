from pydantic import BaseModel, Field
from typing import Optional

class UserMain(BaseModel):
    id_user: int
    username: str
    email: str
    password: str
    no_hp:str

class UserRequest(BaseModel):
    username: str
    email: str
    password : str
    no_hp: str
    
class UserResponse(BaseModel):
    id_user: int
    username: str
    email: str
    level: str

class UserId(BaseModel):
    id_user: int