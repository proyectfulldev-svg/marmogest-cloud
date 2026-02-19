# app/api/v1/__init__.py
from fastapi import APIRouter
from app.api.v1 import auth, invoices

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(invoices.router)