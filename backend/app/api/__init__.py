from fastapi import APIRouter
from app.api.v1 import auth, invoices, suppliers  # ← AGREGAR suppliers

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(invoices.router, prefix="/invoices", tags=["Invoices"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["Suppliers"])  # ← AGREGAR