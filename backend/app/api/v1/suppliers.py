from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from math import ceil

from app.core.database import get_db
from app.api.deps import get_current_user, get_current_active_admin
from app.models.supplier import Supplier
from app.models.user import User
from app.schemas.supplier import SupplierCreate, SupplierUpdate, SupplierResponse, SupplierPaginated

router = APIRouter()


# GET /api/v1/suppliers - Listar proveedores con filtros y paginación
@router.get("/", response_model=SupplierPaginated)
def get_suppliers(
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(10, ge=1, le=100, description="Registros por página"),
    is_active: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    search: Optional[str] = Query(None, description="Buscar por nombre o producto"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Supplier)

    # Filtro por estado
    if is_active is not None:
        query = query.filter(Supplier.is_active == is_active)

    # Búsqueda general
    if search:
        query = query.filter(
            or_(
                Supplier.name.ilike(f"%{search}%"),
                Supplier.product.ilike(f"%{search}%"),
                Supplier.email.ilike(f"%{search}%")
            )
        )

    # Total de registros
    total = query.count()

    # Paginación
    offset = (page - 1) * page_size
    suppliers = query.order_by(Supplier.created_at.desc()).offset(offset).limit(page_size).all()

    return SupplierPaginated(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
        items=suppliers
    )


# GET /api/v1/suppliers/{id} - Ver detalle de un proveedor
@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()

    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )

    return supplier


# POST /api/v1/suppliers - Crear un proveedor
@router.post("/", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
def create_supplier(
    supplier_data: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar si ya existe un proveedor con el mismo nombre
    existing = db.query(Supplier).filter(Supplier.name == supplier_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un proveedor con ese nombre"
        )

    supplier = Supplier(**supplier_data.dict())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)

    return supplier


# PUT /api/v1/suppliers/{id} - Actualizar un proveedor
@router.put("/{supplier_id}", response_model=SupplierResponse)
def update_supplier(
    supplier_id: int,
    supplier_data: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()

    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )

    # Verificar nombre duplicado si se está cambiando
    if supplier_data.name and supplier_data.name != supplier.name:
        existing = db.query(Supplier).filter(Supplier.name == supplier_data.name).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un proveedor con ese nombre"
            )

    # Actualizar solo los campos enviados
    update_data = supplier_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(supplier, field, value)

    db.commit()
    db.refresh(supplier)

    return supplier


# DELETE /api/v1/suppliers/{id} - Eliminar un proveedor (solo admin)
@router.delete("/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()

    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )

    # Verificar si tiene órdenes de compra asociadas
    if supplier.purchase_orders:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar un proveedor con órdenes de compra asociadas"
        )

    db.delete(supplier)
    db.commit()