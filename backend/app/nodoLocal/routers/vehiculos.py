from fastapi import APIRouter, HTTPException, Query
from uuid import uuid4
from app.nodoLocal.schemas.vehiculo import VehiculoCreate, VehiculoOut
from app.nodoLocal.utils.mongoUtils import insert_with_ip, get_items_by_ip

router = APIRouter(prefix="/nodo-local/vehiculos", tags=["Vehículos"])

@router.post("/", response_model=VehiculoOut)
async def registrar_vehiculo(data: VehiculoCreate, ip_nodo: str = Query(...)):
    vehiculo_dict = data.dict()
    vehiculo_dict["idVehiculo"] = "VEH" + uuid4().hex[:6].upper()
    insertado_id = await insert_with_ip("vehiculos", vehiculo_dict, ip_nodo)
    vehiculo_dict["id"] = insertado_id
    return vehiculo_dict

@router.get("/", response_model=list[VehiculoOut])
async def obtener_vehiculos(ip_nodo: str = Query(...)):
    return await get_items_by_ip("vehiculos", ip_nodo)