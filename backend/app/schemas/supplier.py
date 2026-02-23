from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# Schema base con los campos comunes
class SupplierBase(BaseModel):
    name: str
    product: str
    phone: str

    # Campos opcionales
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    notes: Optional[str] = None

    # Estado
    is_active: bool = True


# Schema para crear un proveedor
class SupplierCreate(SupplierBase):
    pass


# Schema para actualizar un proveedor (todos los campos opcionales)
class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    product: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


# Schema para la respuesta (lo que se devuelve al frontend)
class SupplierResponse(SupplierBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Schema para paginación
class SupplierPaginated(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    items: list[SupplierResponse]