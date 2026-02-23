from pydantic import BaseModel, validator
from datetime import date, datetime
from typing import Optional
from decimal import Decimal
from app.models.purchase_order import OrderStatus


# Schema para los items de la orden
class OrderItemBase(BaseModel):
    material_name: str
    quantity: Decimal
    unit_price: Decimal
    material_id: Optional[int] = None

    @validator("quantity", "unit_price")
    def must_be_positive(cls, value):
        if value <= 0:
            raise ValueError("El valor debe ser mayor a 0")
        return value


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(OrderItemBase):
    id: int
    subtotal: Decimal
    order_id: int

    class Config:
        from_attributes = True


# Schema base de la orden
class PurchaseOrderBase(BaseModel):
    order_number: str
    supplier_id: int
    order_date: date
    expected_date: date
    observations: Optional[str] = None

    @validator("expected_date")
    def expected_after_order(cls, expected_date, values):
        if "order_date" in values and expected_date <= values["order_date"]:
            raise ValueError("La fecha esperada debe ser posterior a la fecha de orden")
        return expected_date


# Schema para crear una orden
class PurchaseOrderCreate(PurchaseOrderBase):
    items: list[OrderItemCreate]

    @validator("items")
    def items_not_empty(cls, items):
        if not items:
            raise ValueError("La orden debe tener al menos un item")
        return items


# Schema para actualizar una orden
class PurchaseOrderUpdate(BaseModel):
    expected_date: Optional[date] = None
    observations: Optional[str] = None
    items: Optional[list[OrderItemCreate]] = None


# Schema para actualizar solo el estado
class PurchaseOrderStatusUpdate(BaseModel):
    status: OrderStatus
    received_date: Optional[date] = None

    @validator("received_date", always=True)
    def received_date_required(cls, received_date, values):
        if "status" in values and values["status"] == OrderStatus.received and not received_date:
            raise ValueError("La fecha de recepción es requerida al marcar como recibido")
        return received_date


# Schema para la respuesta
class PurchaseOrderResponse(PurchaseOrderBase):
    id: int
    status: OrderStatus
    total: Decimal
    received_date: Optional[date] = None
    user_id: int
    items: list[OrderItemResponse]
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Schema para paginación
class PurchaseOrderPaginated(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    items: list[PurchaseOrderResponse]