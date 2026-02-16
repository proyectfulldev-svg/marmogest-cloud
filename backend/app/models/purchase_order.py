from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


# Enum para los estados de la orden de compra
class OrderStatus(str, enum.Enum):
    pending = "pending"           # Pendiente
    in_transit = "in_transit"     # En tránsito
    received = "received"         # Recibido
    cancelled = "cancelled"       # Cancelado


class PurchaseOrder(Base):
    # Nombre de la tabla en la base de datos
    __tablename__ = "purchase_orders"

    # Columnas de la tabla
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, nullable=False, index=True)

    # Llave foránea - proveedor de la orden
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)

    # Fechas
    order_date = Column(Date, nullable=False)
    expected_date = Column(Date, nullable=False)
    received_date = Column(Date, nullable=True)

    # Estado y total
    status = Column(Enum(OrderStatus), default=OrderStatus.pending, nullable=False)
    total = Column(Numeric(10, 2), nullable=False, default=0.00)
    observations = Column(Text, nullable=True)

    # Llave foránea - usuario que creó la orden
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Fechas automáticas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    supplier = relationship("Supplier", backref="purchase_orders")
    user = relationship("User", backref="purchase_orders")
    items = relationship("OrderItem", backref="order", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<PurchaseOrder {self.order_number}>"


class OrderItem(Base):
    # Nombre de la tabla en la base de datos
    __tablename__ = "order_items"

    # Columnas de la tabla
    id = Column(Integer, primary_key=True, index=True)

    # Llave foránea - orden a la que pertenece este item
    order_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False)

    # Llave foránea - material del inventario (opcional)
    material_id = Column(Integer, ForeignKey("inventory.id"), nullable=True)

    # Datos del item
    material_name = Column(String(100), nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)

    def __repr__(self):
        return f"<OrderItem {self.material_name} x{self.quantity}>"