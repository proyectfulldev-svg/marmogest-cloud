from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base


class Supplier(Base):
    # Nombre de la tabla en la base de datos
    __tablename__ = "suppliers"

    # Columnas de la tabla
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    product = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)

    # Campos opcionales
    email = Column(String(100), nullable=True)
    address = Column(String(200), nullable=True)
    notes = Column(Text, nullable=True)

    # Estado del proveedor
    is_active = Column(Boolean, default=True, nullable=False)

    # Fechas automáticas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Supplier {self.name}>"