from fastapi import APIRouter, HTTPException
from app.nodoLocal.schemas.vehiculo import VehiculoCreate
from app.nodoLocal.database.mongoSelector import get_mongo_db_por_nodo

router = APIRouter(prefix="/nodo/{nodo_id}/vehiculos", tags=["Vehiculos"])

@router.post("/")
def crear_vehiculo(nodo_id: int, vehiculo: VehiculoCreate):
    """
    Crea un nuevo vehículo en la base de datos MongoDB del nodo correspondiente.

    Args:
        nodo_id (int): ID del nodo donde se registrará el vehículo.
        vehiculo (VehiculoCreate): Datos del vehículo a registrar.

    Returns:
        dict: Mensaje de éxito y el ID del vehículo creado.

    Raises:
        HTTPException: Si ocurre un error al insertar el vehículo.
    """
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        resultado = db["vehiculos"].insert_one(vehiculo.dict())
        return {"msg": "Vehiculo creado", "id": str(resultado.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))