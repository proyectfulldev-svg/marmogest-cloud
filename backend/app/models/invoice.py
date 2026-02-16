from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


# Enum para los estados de la factura
class InvoiceStatus(str, enum.Enum):
    pending = "pending"       # Pendiente
    in_process = "in_process" # En proceso
    finished = "finished"     # Terminado
    delivered = "delivered"   # Entregado


class Invoice(Base):
    # Nombre de la tabla en la base de datos
    __tablename__ = "invoices"

    # Columnas de la tabla
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(20), unique=True, nullable=False, index=True)
    client_number = Column(String(20), unique=True, nullable=False)

    # Datos del cliente
    client_name = Column(String(100), nullable=False)
    client_phone = Column(String(20), nullable=True)
    client_email = Column(String(100), nullable=True)

    # Datos del difunto
    deceased_name = Column(String(100), nullable=False)

    # Datos del trabajo
    work_type = Column(String(100), nullable=False)
    dimensions = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    main_material = Column(String(100), nullable=True)
    observations = Column(Text, nullable=True)

    # Datos financieros
    total_price = Column(Numeric(10, 2), nullable=False)
    initial_payment = Column(Numeric(10, 2), default=0.00, nullable=False)
    balance = Column(Numeric(10, 2), nullable=False)

    # Fechas
    sale_date = Column(Date, nullable=False)
    delivery_date = Column(Date, nullable=False)

    # Estado
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.pending, nullable=False)

    # Llave foránea - usuario que creó la factura
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Fechas automáticas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relación con el modelo User
    user = relationship("User", backref="invoices")

    def __repr__(self):
        return f"<Invoice {self.invoice_number} - {self.client_name}>"