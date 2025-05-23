# app/routers/pagos.py
from fastapi import APIRouter

router = APIRouter(prefix="/pagos", tags=["Pagos"])

@router.get("/")
def test():
    return {"msg": "Router de pagos activo"}
