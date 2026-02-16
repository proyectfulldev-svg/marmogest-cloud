from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
import enum
from app.core.database import Base


# Enum para los roles de usuario
class UserRole(str, enum.Enum):
    admin = "admin"
    operator = "operator"


class User(Base):
    # Nombre de la tabla en la base de datos
    __tablename__ = "users"

    # Columnas de la tabla
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.operator, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Fechas automáticas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<User {self.email}>"