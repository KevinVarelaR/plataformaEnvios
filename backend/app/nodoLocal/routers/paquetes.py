from fastapi import APIRouter, HTTPException
from app.nodoLocal.schemas.paquete import PaqueteCreate
from app.nodoLocal.database.mongoSelector import get_mongo_db_por_nodo
import requests
import uuid

router = APIRouter(prefix="/nodo/{nodo_id}/paquetes", tags=["Paquetes"])

@router.post("/")
def crear_paquete(nodo_id: int, paquete: PaqueteCreate):
    """
    Crea un nuevo paquete en la base de datos MongoDB del nodo correspondiente,
    y registra el envío y su pago en el servidor central.

    Args:
        nodo_id (int): ID del nodo donde se registrará el paquete.
        paquete (PaqueteCreate): Datos del paquete a registrar.

    Returns:
        dict: Mensaje de éxito, ID del paquete, envío y pago.

    Raises:
        HTTPException: Si ocurre un error al insertar el paquete, envío o pago.
    """
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        qr_code = str(uuid.uuid4())
        paquete_data = paquete.dict()
        paquete_data["qr_code"] = qr_code

        resultado = db["paquetes"].insert_one(paquete_data)
        paquete_id = str(resultado.inserted_id)

        envio_data = {
            "cliente_id": paquete.cliente_id,
            "nodo_origen_id": nodo_id,
            "nodo_destino_id": paquete.nodo_destino_id,
            "estado": "CREADO",
            "fecha_entrega": None,
            "qr_code": qr_code
        }
        r = requests.post("http://localhost:8000/envios/envio/", json=envio_data)
        if r.status_code != 200:
            raise Exception(f"Error al registrar envío: {r.text}")
        envio = r.json()

        return {
            "msg": "Paquete, envío y pago registrados",
            "paquete_id": paquete_id,
            "envio": envio,
            "qr_code": qr_code
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/", response_model=list[dict])
def listar_paquetes(nodo_id: int):
    """
    Lista todos los paquetes registrados en la base de datos MongoDB del nodo correspondiente.

    Args:
        nodo_id (int): ID del nodo donde se consultarán los paquetes.

    Returns:
        list[dict]: Lista de paquetes registrados.

    Raises:
        HTTPException: Si ocurre un error al consultar los paquetes.
    """
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        paquetes = list(db["paquetes"].find())
        for paquete in paquetes:
            paquete["_id"] = str(paquete["_id"])
        return paquetes
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))