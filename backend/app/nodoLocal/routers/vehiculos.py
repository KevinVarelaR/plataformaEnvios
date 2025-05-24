from fastapi import APIRouter, HTTPException
from app.nodoLocal.schemas.vehiculo import VehiculoCreate
from app.nodoLocal.database.mongoSelector import get_mongo_db_por_nodo

router = APIRouter(prefix="/nodo/{nodo_id}/vehiculos", tags=["Vehiculos"])

@router.post("/")
def crear_vehiculo(nodo_id: int, vehiculo: VehiculoCreate):
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        resultado = db["vehiculos"].insert_one(vehiculo.dict())
        return {"msg": "Vehiculo creado", "id": str(resultado.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))