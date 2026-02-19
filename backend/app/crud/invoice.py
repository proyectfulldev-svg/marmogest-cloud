# app/crud/invoice.py
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from datetime import date, datetime, timedelta
from decimal import Decimal
from app.models.invoice import Invoice, InvoiceStatus
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate


def generate_invoice_number(db: Session) -> str:
    """Genera número de factura auto-incremental: FAC-0001, FAC-0002..."""
    last_invoice = db.query(Invoice).order_by(Invoice.id.desc()).first()
    if not last_invoice:
        return "FAC-0001"
    last_number = int(last_invoice.invoice_number.split("-")[1])
    return f"FAC-{str(last_number + 1).zfill(4)}"


def get_invoice(db: Session, invoice_number: str) -> Invoice | None:
    """Obtiene una factura activa por número de factura"""
    return db.query(Invoice).filter(Invoice.invoice_number == invoice_number).first()


def get_invoices(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    search: str | None = None,
    status: InvoiceStatus | None = None,
    work_type: str | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
) -> tuple[list[Invoice], int]:
    """Lista facturas con filtros y paginación"""
    query = db.query(Invoice)

    # Búsqueda por número de factura, nombre cliente o difunto
    if search:
        query = query.filter(
            or_(
                Invoice.invoice_number.ilike(f"%{search}%"),
                Invoice.client_name.ilike(f"%{search}%"),
                Invoice.deceased_name.ilike(f"%{search}%"),
            )
        )

    # Filtros
    if status:
        query = query.filter(Invoice.status == status)
    if work_type:
        query = query.filter(Invoice.work_type.ilike(f"%{work_type}%"))
    if date_from:
        query = query.filter(Invoice.sale_date >= date_from)
    if date_to:
        query = query.filter(Invoice.sale_date <= date_to)

    total = query.count()
    items = query.order_by(Invoice.id.desc()).offset(skip).limit(limit).all()
    return items, total


def create_invoice(db: Session, invoice_data: InvoiceCreate, user_id: int) -> Invoice:
    """Crea una nueva factura y calcula el saldo automáticamente"""
    initial_payment = invoice_data.initial_payment or Decimal("0")
    balance = invoice_data.total_price - initial_payment

    db_invoice = Invoice(
        **invoice_data.model_dump(),
        invoice_number=generate_invoice_number(db),
        balance=balance,
        user_id=user_id,
    )

    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice


def update_invoice(db: Session, invoice_number: str, invoice_data: InvoiceUpdate) -> Invoice | None:
    """Actualiza una factura buscándola por número de factura"""
    db_invoice = get_invoice(db, invoice_number)
    if not db_invoice:
        return None

    update_data = invoice_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_invoice, field, value)

    if "total_price" in update_data or "initial_payment" in update_data:
        db_invoice.balance = db_invoice.total_price - (db_invoice.initial_payment or Decimal("0"))

    db.commit()
    db.refresh(db_invoice)
    return db_invoice


def delete_invoice(db: Session, invoice_number: str) -> bool:
    """Eliminación lógica buscando por número de factura"""
    db_invoice = get_invoice(db, invoice_number)
    if not db_invoice:
        return False

    db_invoice.status = InvoiceStatus.delivered
    db.commit()
    return True


def get_invoice_stats(db: Session) -> dict:
    """Estadísticas para el dashboard principal"""
    today = date.today()
    mes_actual = today.month
    anio_actual = today.year
    fin_semana = today + timedelta(days=7)

    # Total de facturas activas
    total_invoices = db.query(func.count(Invoice.id)).scalar()

    # Ingresos del mes actual
    monthly_income = db.query(func.sum(Invoice.total_price)).filter(
        func.extract("month", Invoice.sale_date) == mes_actual,
        func.extract("year", Invoice.sale_date) == anio_actual,
    ).scalar() or 0

    # Entregas pendientes esta semana
    pending_deliveries = db.query(func.count(Invoice.id)).filter(
        Invoice.delivery_date >= today,
        Invoice.delivery_date <= fin_semana,
        Invoice.status != InvoiceStatus.delivered,
    ).scalar()

    # Últimas 5 facturas creadas
    latest_invoices = db.query(Invoice).order_by(Invoice.id.desc()).limit(5).all()

    return {
        "total_invoices": total_invoices,
        "monthly_income": float(monthly_income),
        "pending_deliveries_this_week": pending_deliveries,
        "latest_invoices": latest_invoices,
    }