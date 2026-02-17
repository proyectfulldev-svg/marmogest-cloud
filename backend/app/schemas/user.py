from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.models.user import UserRole


class UserBase(BaseModel):
    """Campos comunes de usuario"""
    email: EmailStr
    full_name: str
    role: UserRole


class UserCreate(UserBase):
    """Schema para crear un usuario (incluye password)"""
    password: str


class UserUpdate(BaseModel):
    """Schema para actualizar un usuario (todos opcionales)"""
    email: EmailStr | None = None
    full_name: str | None = None
    role: UserRole | None = None
    is_active: bool | None = None


class UserInDB(UserBase):
    """Schema de usuario con todos los campos de BD"""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime | None

    model_config = {"from_attributes": True}


class User(UserInDB):
    """Schema público de usuario (sin password_hash)"""
    pass