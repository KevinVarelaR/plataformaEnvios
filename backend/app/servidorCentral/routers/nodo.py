from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.servidorCentral.database.centralPG import SessionLocal
from app.servidorCentral.models.nodo import NodoLocal
from app.servidorCentral.schemas.nodo import NodoCreate, NodoResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=NodoResponse)
def registrar_nodo(nodo: NodoCreate, db: Session = Depends(get_db)):
    ip_str = str(nodo.ip_registrada)

    if db.query(NodoLocal).filter(NodoLocal.ip_registrada == ip_str).first():
        raise HTTPException(status_code=400, detail="Ya existe un nodo con esa IP")

    nuevo = NodoLocal(
        nombre=nodo.nombre,
        ip_registrada=ip_str, 
        validado=nodo.validado
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=list[NodoResponse])
def listar_nodos(db: Session = Depends(get_db)):
    return db.query(NodoLocal).all()

@router.get("/validar", response_model=NodoResponse)
def validar_ip(request: Request, db: Session = Depends(get_db)):
    ip = request.client.host
    nodo = db.query(NodoLocal).filter(NodoLocal.ip_registrada == ip, NodoLocal.validado == True).first()
    if not nodo:
        raise HTTPException(status_code=403, detail="IP no autorizada o nodo no validado")
    return nodo
