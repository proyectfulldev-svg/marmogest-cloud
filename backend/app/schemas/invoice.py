# app/schemas/invoice.py
from pydantic import BaseModel, field_validator, model_validator
from typing import Optional
from datetime import date, datetime
from decimal import Decimal
from app.models.invoice import InvoiceStatus


class InvoiceBase(BaseModel):
    # Campos obligatorios
    client_number: str
    client_name: str
    deceased_name: str
    work_type: str
    dimensions: str
    description: str
    total_price: Decimal
    sale_date: date
    delivery_date: date
    status: InvoiceStatus = InvoiceStatus.pending

    # Campos opcionales
    initial_payment: Optional[Decimal] = Decimal("0")
    client_phone: Optional[str] = None
    client_email: Optional[str] = None
    main_material: Optional[str] = None
    observations: Optional[str] = None

    @field_validator("total_price")
    @classmethod
    def price_must_be_positive(cls, v):
        # El precio debe ser mayor a 0
        if v <= 0:
            raise ValueError("El precio debe ser mayor a 0")
        return v

    @model_validator(mode="after")
    def validate_business_rules(self):
        # La fecha de entrega debe ser posterior a la fecha de venta
        if self.delivery_date <= self.sale_date:
            raise ValueError("La fecha de entrega debe ser posterior a la fecha de venta")
        # El abono no puede superar el precio total
        if self.initial_payment and self.initial_payment > self.total_price:
            raise ValueError("El abono no puede ser mayor al precio total")
        return self


class InvoiceCreate(InvoiceBase):
    # Hereda todo, invoice_number se autogenera en el backend
    pass


class InvoiceUpdate(BaseModel):
    # Todos opcionales para permitir actualizaciones parciales
    client_number: Optional[str] = None
    client_name: Optional[str] = None
    client_phone: Optional[str] = None
    client_email: Optional[str] = None
    deceased_name: Optional[str] = None
    work_type: Optional[str] = None
    dimensions: Optional[str] = None
    description: Optional[str] = None
    main_material: Optional[str] = None
    observations: Optional[str] = None
    total_price: Optional[Decimal] = None
    initial_payment: Optional[Decimal] = None
    sale_date: Optional[date] = None
    delivery_date: Optional[date] = None
    status: Optional[InvoiceStatus] = None


class InvoiceResponse(InvoiceBase):
    # Lo que devolvemos al frontend
    id: int
    invoice_number: str
    balance: Decimal
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class InvoiceListResponse(BaseModel):
    # Respuesta paginada
    items: list[InvoiceResponse]
    total: int
    page: int
    per_page: int
    pages: int