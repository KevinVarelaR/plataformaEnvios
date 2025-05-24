from fastapi import APIRouter, HTTPException
from app.nodoLocal.schemas.entrega import EntregaCreate
from app.nodoLocal.database.mongoSelector import get_mongo_db_por_nodo
from datetime import datetime
import requests

router = APIRouter(prefix="/nodo/{nodo_id}/entregas", tags=["Entregas"])

@router.post("/")
def registrar_entrega(nodo_id: int, entrega: EntregaCreate):
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        data = entrega.dict()
        if not data.get("fecha_entrega"):
            data["fecha_entrega"] = datetime.utcnow()
        resultado = db["entregas"].insert_one(data)
        return {"msg": "Entrega registrada", "id": str(resultado.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/sincronizar")
def sincronizar_entregas(nodo_id: int):
    try:
        db = get_mongo_db_por_nodo(nodo_id)
        entregas = db["entregas"].find({"sincronizado": {"$ne": True}})

        sincronizadas = 0
        errores = []

        for entrega in entregas:
            paquete = db["paquetes"].find_one({"_id": entrega["paquete_id"]})
            if not paquete or not paquete.get("qr_code"):
                errores.append(str(entrega.get("_id")))
                continue

            qr = paquete["qr_code"]
            try:
                r = requests.put(f"http://localhost:8000/envios/qr/{qr}/entregar")
                if r.status_code == 200:
                    db["entregas"].update_one({"_id": entrega["_id"]}, {"$set": {"sincronizado": True}})
                    sincronizadas += 1
                else:
                    errores.append(str(entrega.get("_id")))
            except Exception as ex:
                errores.append(str(entrega.get("_id")))

        return {"sincronizadas": sincronizadas, "errores": errores}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
