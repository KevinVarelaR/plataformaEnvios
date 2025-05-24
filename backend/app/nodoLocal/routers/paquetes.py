from fastapi import APIRouter, HTTPException
from app.nodoLocal.schemas.paquete import PaqueteCreate
from app.nodoLocal.database.mongoSelector import get_mongo_db_por_nodo

router = APIRouter(prefix="/nodo/{nodo_id}/paquetes", tags=["Paquetes"])

@router.post("/")
def crear_paquete(nodo_id: int, paquete: PaqueteCreate):
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        resultado = db["paquetes"].insert_one(paquete.dict())
        return {"msg": "Paquete registrado", "id": str(resultado.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
