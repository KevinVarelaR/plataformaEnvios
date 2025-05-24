from fastapi import APIRouter, HTTPException, Depends
from app.nodoLocal.schemas.entrega import EntregaCreate
from app.nodoLocal.database.mongoSelector import get_mongo_db_por_nodo
from datetime import datetime
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session
from app.servidorCentral.models.envio import Envio, EstadoEnvioEnum
from app.servidorCentral.database.centralPG import SessionLocal

router = APIRouter(prefix="/nodo/{nodo_id}/entregas", tags=["Entregas"])

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

@router.post("/")
def registrar_entrega(nodo_id: int, entrega: EntregaCreate):
    """
    Registra una nueva entrega en la base de datos MongoDB del nodo correspondiente.

    Args:
        nodo_id (int): ID del nodo donde se registrará la entrega.
        entrega (EntregaCreate): Datos de la entrega a registrar.

    Returns:
        dict: Mensaje de éxito y el ID de la entrega registrada.

    Raises:
        HTTPException: Si ocurre un error al insertar la entrega.
    """
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        data = entrega.dict()
        if not data.get("fecha_entrega"):
            data["fecha_entrega"] = datetime.utcnow()
        resultado = db["entregas"].insert_one(data)
        return {"msg": "Entrega registrada", "id": str(resultado.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/qr/{qr_code}/sincronizar", response_model=dict)
def sincronizar_entrega(qr_code: UUID, db: Session = Depends(get_db)):
    """
    Sincroniza el estado de un envío en la base de datos central, cambiando su estado a EN_TRANSITO.

    Args:
        qr_code (UUID): Código QR del envío a sincronizar.
        db (Session, opcional): Sesión de base de datos PostgreSQL.

    Returns:
        dict: Información actualizada del envío.

    Raises:
        HTTPException: Si el envío no se encuentra.
    """
    envio = db.query(Envio).filter(Envio.qr_code == qr_code).first()
    if not envio:
        raise HTTPException(status_code=404, detail="Envío no encontrado")

    envio.estado = EstadoEnvioEnum.EN_TRANSITO
    envio.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(envio)
    return {
        "envio_id": envio.envio_id,
        "cliente_id": envio.cliente_id,
        "nodo_origen_id": envio.nodo_origen_id,
        "nodo_destino_id": envio.nodo_destino_id,
        "estado": envio.estado,
        "fecha_entrega": envio.fecha_entrega,
        "qr_code": str(envio.qr_code),
        "updated_at": envio.updated_at,
    }

@router.get("/", response_model=list[dict])
def listar_entregas(nodo_id: int):
    """
    Lista todas las entregas registradas en la base de datos MongoDB del nodo correspondiente.

    Args:
        nodo_id (int): ID del nodo donde se consultarán las entregas.

    Returns:
        list[dict]: Lista de entregas registradas.

    Raises:
        HTTPException: Si ocurre un error al consultar las entregas.
    """
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        entregas = list(db["entregas"].find())
        for entrega in entregas:
            entrega["_id"] = str(entrega["_id"])
        return entregas
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))