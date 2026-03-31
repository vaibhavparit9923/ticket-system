from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum

# 🔐 Role fix (IMPORTANT)
class Role(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"

# 👤 Request model (Signup)
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    role: Role = Role.USER   # default सुरक्षित

# 📦 DB model
class UserInDB(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role

# 📤 Response model (SAFE)
class UserResponse(BaseModel):
    name: str
    email: EmailStr
    role: Role