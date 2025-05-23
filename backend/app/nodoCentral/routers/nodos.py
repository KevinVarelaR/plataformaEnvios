# app/routers/nodos.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ipaddress import IPv4Address
from app.nodoCentral.database.centralPG import get_db
from app.nodoCentral.models.nodo import NodoLocal
from app.nodoCentral.schemas.nodo import NodoCreate, NodoOut
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

router = APIRouter(prefix="/nodos", tags=["Nodos Locales"])

# 1. Registrar un nodo local (no validado por defecto)
@router.post("/", response_model=NodoOut)
def registrar_nodo(nodo: NodoCreate, db: Session = Depends(get_db)):
    existente = db.query(NodoLocal).filter(NodoLocal.ip_registrada == str(nodo.ip_registrada)).first()
    if existente:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Ya existe un nodo con esa IP")

    nuevo_nodo = NodoLocal(
        nombre=nodo.nombre,
        ip_registrada=str(nodo.ip_registrada)
    )
    db.add(nuevo_nodo)
    db.commit()
    db.refresh(nuevo_nodo)
    return nuevo_nodo

# 2. Listar todos los nodos validados
@router.get("/validados", response_model=list[NodoOut])
def nodos_validados(db: Session = Depends(get_db)):
    return db.query(NodoLocal).filter(NodoLocal.validado == True).all()

# 3. Verificar si una IP está validada (desde nodos locales)
@router.get("/buscar-por-ip", response_model=NodoOut)
def buscar_por_ip(ip: IPv4Address = Query(...), db: Session = Depends(get_db)):
    nodo = db.query(NodoLocal).filter(NodoLocal.ip_registrada == str(ip), NodoLocal.validado == True).first()
    if not nodo:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Nodo no validado o no existe")
    return nodo
