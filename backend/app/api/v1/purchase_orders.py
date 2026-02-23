from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from decimal import Decimal
from math import ceil
from datetime import date

from app.core.database import get_db
from app.api.deps import get_current_user, get_current_active_admin  # ← CORREGIDO v1.deps
from app.models.purchase_order import PurchaseOrder, OrderItem, OrderStatus
from app.models.inventory import Inventory, InventoryMovement, MovementType, MaterialCategory  # ← AGREGADO
from app.models.user import User
from app.schemas.purchase_order import (
    PurchaseOrderCreate,
    PurchaseOrderUpdate,
    PurchaseOrderStatusUpdate,
    PurchaseOrderResponse,
    PurchaseOrderPaginated
)

router = APIRouter()


# Función auxiliar para calcular el total de la orden
def calculate_order_total(items) -> Decimal:
    return sum(item.quantity * item.unit_price for item in items)


# GET /api/v1/purchase-orders - Listar órdenes con filtros y paginación
@router.get("/", response_model=PurchaseOrderPaginated)
def get_purchase_orders(
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(10, ge=1, le=100, description="Registros por página"),
    order_status: Optional[OrderStatus] = Query(None, description="Filtrar por estado"),  # ← RENOMBRADO para evitar conflicto con status de fastapi
    supplier_id: Optional[int] = Query(None, description="Filtrar por proveedor"),
    search: Optional[str] = Query(None, description="Buscar por número de orden"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(PurchaseOrder)

    # Filtros
    if order_status:
        query = query.filter(PurchaseOrder.status == order_status)

    if supplier_id:
        query = query.filter(PurchaseOrder.supplier_id == supplier_id)

    if search:
        query = query.filter(
            PurchaseOrder.order_number.ilike(f"%{search}%")
        )

    total = query.count()
    offset = (page - 1) * page_size
    orders = query.order_by(PurchaseOrder.created_at.desc()).offset(offset).limit(page_size).all()

    return PurchaseOrderPaginated(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
        items=orders
    )


# GET /api/v1/purchase-orders/{id} - Ver detalle de una orden
@router.get("/{order_id}", response_model=PurchaseOrderResponse)
def get_purchase_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden de compra no encontrada"
        )

    return order


# POST /api/v1/purchase-orders - Crear una orden
@router.post("/", response_model=PurchaseOrderResponse, status_code=status.HTTP_201_CREATED)
def create_purchase_order(
    order_data: PurchaseOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar número de orden único
    existing = db.query(PurchaseOrder).filter(
        PurchaseOrder.order_number == order_data.order_number
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una orden con ese número"
        )

    # Crear los items y calcular subtotales
    items = []
    for item_data in order_data.items:
        subtotal = item_data.quantity * item_data.unit_price
        item = OrderItem(
            material_name=item_data.material_name,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            subtotal=subtotal,
            material_id=item_data.material_id
        )
        items.append(item)

    # Calcular total
    total = sum(item.subtotal for item in items)

    # Crear la orden
    order = PurchaseOrder(
        order_number=order_data.order_number,
        supplier_id=order_data.supplier_id,
        order_date=order_data.order_date,
        expected_date=order_data.expected_date,
        observations=order_data.observations,
        total=total,
        user_id=current_user.id,
        items=items
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


# PUT /api/v1/purchase-orders/{id} - Actualizar una orden (solo si está pendiente)
@router.put("/{order_id}", response_model=PurchaseOrderResponse)
def update_purchase_order(
    order_id: int,
    order_data: PurchaseOrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden de compra no encontrada"
        )

    # Solo se puede editar si está pendiente
    if order.status != OrderStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo se pueden editar órdenes en estado pendiente"
        )

    # Actualizar campos básicos
    if order_data.expected_date:
        order.expected_date = order_data.expected_date
    if order_data.observations is not None:
        order.observations = order_data.observations

    # Actualizar items si se enviaron
    if order_data.items is not None:
        # Eliminar items anteriores
        for item in order.items:
            db.delete(item)

        # Crear nuevos items
        new_items = []
        for item_data in order_data.items:
            subtotal = item_data.quantity * item_data.unit_price
            item = OrderItem(
                order_id=order.id,
                material_name=item_data.material_name,
                quantity=item_data.quantity,
                unit_price=item_data.unit_price,
                subtotal=subtotal,
                material_id=item_data.material_id
            )
            new_items.append(item)

        order.items = new_items
        order.total = sum(item.subtotal for item in new_items)

    db.commit()
    db.refresh(order)

    return order


# PUT /api/v1/purchase-orders/{id}/status - Actualizar estado de la orden
@router.put("/{order_id}/status", response_model=PurchaseOrderResponse)
def update_order_status(
    order_id: int,
    status_data: PurchaseOrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden de compra no encontrada"
        )

    # No se puede cambiar estado de una orden cancelada o ya recibida
    if order.status in [OrderStatus.cancelled, OrderStatus.received]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede cambiar el estado de una orden {order.status.value}"
        )

    # Si se marca como recibido, actualizar inventario automáticamente
    if status_data.status == OrderStatus.received:
        order.received_date = status_data.received_date

        for item in order.items:
            if item.material_id:
                # Material existente en inventario - actualizar stock
                material = db.query(Inventory).filter(
                    Inventory.id == item.material_id
                ).first()
                if material:
                    material.current_stock += item.quantity

                    # Registrar movimiento de entrada
                    movement = InventoryMovement(
                        material_id=material.id,
                        movement_type=MovementType.entry,
                        quantity=item.quantity,
                        reason=f"Recepción de orden {order.order_number}",
                        order_id=order.id,
                        user_id=current_user.id
                    )
                    db.add(movement)
            else:
                # Material nuevo - crear en inventario
                new_material = Inventory(
                    name=item.material_name,
                    category=MaterialCategory.other,  # ← categoría por defecto
                    current_stock=item.quantity,
                    minimum_stock=0,
                    unit_of_measure="unidad",  # ← nombre correcto del campo
                    unit_price=item.unit_price
                )
                db.add(new_material)
                db.flush()  # Para obtener el id antes del commit

                # Registrar movimiento de entrada
                movement = InventoryMovement(
                    material_id=new_material.id,
                    movement_type=MovementType.entry,
                    quantity=item.quantity,
                    reason=f"Recepción de orden {order.order_number}",
                    order_id=order.id,
                    user_id=current_user.id
                )
                db.add(movement)

    order.status = status_data.status
    db.commit()
    db.refresh(order)

    return order


# DELETE /api/v1/purchase-orders/{id} - Eliminar orden (solo admin y solo si está pendiente)
@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_purchase_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden de compra no encontrada"
        )

    if order.status != OrderStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo se pueden eliminar órdenes en estado pendiente"
        )

    db.delete(order)
    db.commit()