from fastapi import APIRouter, HTTPException
from app.nodoLocal.schemas.ruta import RutaCreate
from app.nodoLocal.database.mongoSelector import get_mongo_db_por_nodo

router = APIRouter(prefix="/nodo/{nodo_id}/rutas", tags=["Rutas"])

@router.post("/")
def crear_ruta(nodo_id: int, ruta: RutaCreate):
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        resultado = db["rutas"].insert_one(ruta.dict())
        return {"msg": "Ruta creada", "id": str(resultado.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))