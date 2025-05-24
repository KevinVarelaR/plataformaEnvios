from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.servidorCentral.database.centralPG import SessionLocal
from app.servidorCentral.models.nodo import NodoLocal
from app.servidorCentral.schemas.nodo import NodoCreate, NodoResponse

router = APIRouter()

def get_db():
    """
    Proporciona una sesión de base de datos para cada solicitud.
    Cierra la sesión automáticamente al finalizar.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=NodoResponse)
def registrar_nodo(nodo: NodoCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo nodo en el sistema.

    Args:
        nodo (NodoCreate): Datos del nodo a registrar.
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        NodoResponse: Información del nodo registrado.

    Raises:
        HTTPException: Si ya existe un nodo con la misma IP.
    """
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
    """
    Lista todos los nodos registrados en el sistema.

    Args:
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        list[NodoResponse]: Lista de nodos registrados.
    """
    return db.query(NodoLocal).all()

@router.get("/validar", response_model=NodoResponse)
def validar_ip(request: Request, db: Session = Depends(get_db)):
    """
    Valida si la IP del cliente está registrada y el nodo está validado.

    Args:
        request (Request): Objeto de solicitud HTTP para obtener la IP del cliente.
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        NodoResponse: Información del nodo validado.

    Raises:
        HTTPException: Si la IP no está autorizada o el nodo no está validado.
    """
    ip = request.client.host
    nodo = db.query(NodoLocal).filter(NodoLocal.ip_registrada == ip, NodoLocal.validado == True).first()
    if not nodo:
        raise HTTPException(status_code=403, detail="IP no autorizada o nodo no validado")
    return nodo
