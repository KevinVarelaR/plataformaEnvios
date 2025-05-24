from fastapi import APIRouter, HTTPException
from app.nodoLocal.schemas.mensajero import MensajeroCreate
from app.nodoLocal.database.mongoSelector import get_mongo_db_por_nodo

router = APIRouter(prefix="/nodo/{nodo_id}/mensajeros", tags=["Mensajeros"])

@router.post("/")
def crear_mensajero(nodo_id: int, mensajero: MensajeroCreate):
    """
    Crea un nuevo mensajero en la base de datos MongoDB del nodo correspondiente.

    Args:
        nodo_id (int): ID del nodo donde se registrará el mensajero.
        mensajero (MensajeroCreate): Datos del mensajero a registrar.

    Returns:
        dict: Mensaje de éxito y el ID del mensajero creado.

    Raises:
        HTTPException: Si ocurre un error al insertar el mensajero.
    """
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        resultado = db["mensajeros"].insert_one(mensajero.dict())
        return {"msg": "Mensajero creado", "id": str(resultado.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
