from fastapi import APIRouter, HTTPException
from app.nodoLocal.schemas.ruta import RutaCreate
from app.nodoLocal.database.mongoSelector import get_mongo_db_por_nodo

router = APIRouter(prefix="/nodo/{nodo_id}/rutas", tags=["Rutas"])

@router.post("/")
def crear_ruta(nodo_id: int, ruta: RutaCreate):
    """
    Crea una nueva ruta en la base de datos MongoDB del nodo correspondiente.

    Args:
        nodo_id (int): ID del nodo donde se registrará la ruta.
        ruta (RutaCreate): Datos de la ruta a registrar.

    Returns:
        dict: Mensaje de éxito y el ID de la ruta creada.

    Raises:
        HTTPException: Si ocurre un error al insertar la ruta.
    """
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        resultado = db["rutas"].insert_one(ruta.dict())
        return {"msg": "Ruta creada", "id": str(resultado.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))