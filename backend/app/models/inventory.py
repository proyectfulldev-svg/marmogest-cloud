from sqlalchemy import Column, Integer, String, Numeric, DateTime, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


# Enum para las categorías de materiales
class MaterialCategory(str, enum.Enum):
    marble = "marble"           # Mármol
    ceramic = "ceramic"         # Cerámica
    chemicals = "chemicals"     # Químicos
    tools = "tools"             # Herramientas
    other = "other"             # Otros


# Enum para los tipos de movimiento de inventario
class MovementType(str, enum.Enum):
    entry = "entry"   # Entrada
    exit = "exit"     # Salida


class Inventory(Base):
    # Nombre de la tabla en la base de datos
    __tablename__ = "inventory"

    # Columnas de la tabla
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    category = Column(Enum(MaterialCategory), nullable=False)

    # Llave foránea - proveedor del material
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)

    # Datos de stock
    current_stock = Column(Numeric(10, 2), nullable=False, default=0)
    minimum_stock = Column(Numeric(10, 2), nullable=False, default=0)
    unit_of_measure = Column(String(20), nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False, default=0.00)

    # Campos opcionales
    location = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)

    # Fechas automáticas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    supplier = relationship("Supplier", backref="materials")
    movements = relationship("InventoryMovement", backref="material", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Inventory {self.name}>"


class InventoryMovement(Base):
    # Nombre de la tabla en la base de datos
    __tablename__ = "inventory_movements"

    # Columnas de la tabla
    id = Column(Integer, primary_key=True, index=True)

    # Llave foránea - material al que pertenece el movimiento
    material_id = Column(Integer, ForeignKey("inventory.id"), nullable=False)

    # Tipo y cantidad del movimiento
    movement_type = Column(Enum(MovementType), nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False)
    reason = Column(String(200), nullable=False)

    # Llave foránea - orden de compra asociada (opcional)
    order_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=True)

    # Llave foránea - usuario que realizó el movimiento
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Fecha automática
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    order = relationship("PurchaseOrder", backref="movements")
    user = relationship("User", backref="inventory_movements")

    def __repr__(self):
        return f"<InventoryMovement {self.movement_type} - {self.quantity}>"