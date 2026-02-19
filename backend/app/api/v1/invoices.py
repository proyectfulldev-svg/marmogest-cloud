# app/api/v1/invoices.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional
from app.core.database import get_db
from app.api.deps import get_current_user, get_current_active_admin
from app.models.user import User
from app.models.invoice import InvoiceStatus
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceResponse, InvoiceListResponse
from app.crud import invoice as crud_invoice

router = APIRouter(prefix="/invoices", tags=["Invoices"])


@router.get("/stats")
def get_invoice_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Estadísticas del dashboard: totales, ingresos del mes, entregas pendientes"""
    return crud_invoice.get_invoice_stats(db)


@router.get("/", response_model=InvoiceListResponse)
def list_invoices(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None, description="Buscar por factura, cliente o difunto"),
    status: Optional[InvoiceStatus] = Query(None),
    work_type: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista todas las facturas con paginación y filtros"""
    skip = (page - 1) * per_page
    items, total = crud_invoice.get_invoices(
        db,
        skip=skip,
        limit=per_page,
        search=search,
        status=status,
        work_type=work_type,
        date_from=date_from,
        date_to=date_to,
    )
    pages = (total + per_page - 1) // per_page
    return InvoiceListResponse(items=items, total=total, page=page, per_page=per_page, pages=pages)


@router.post("/", response_model=InvoiceResponse, status_code=201)
def create_invoice(
    invoice_data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Crea una nueva factura"""
    return crud_invoice.create_invoice(db, invoice_data, current_user.id)


@router.get("/{invoice_number}", response_model=InvoiceResponse)
def get_invoice(
    invoice_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtiene el detalle de una factura por número de factura"""
    invoice = crud_invoice.get_invoice(db, invoice_number)
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return invoice


@router.put("/{invoice_number}", response_model=InvoiceResponse)
def update_invoice(
    invoice_number: str,
    invoice_data: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Actualiza los datos de una factura"""
    invoice = crud_invoice.update_invoice(db, invoice_number, invoice_data)
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return invoice


@router.delete("/{invoice_number}", status_code=204)
def delete_invoice(
    invoice_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
):
    """Eliminación lógica de factura (solo administradores)"""
    deleted = crud_invoice.delete_invoice(db, invoice_number)
    if not deleted:
        raise HTTPException(status_code=404, detail="Factura no encontrada")