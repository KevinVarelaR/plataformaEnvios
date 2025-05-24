from pymongo import MongoClient
from app.nodoLocal.config import MONGO_URL
from app.servidorCentral.database.centralPG import SessionLocal
from app.servidorCentral.models.nodo import NodoLocal

client = MongoClient(MONGO_URL)

def get_mongo_db_por_nodo(nodo_id: int):
    db_pg = SessionLocal()
    nodo = db_pg.query(NodoLocal).filter(NodoLocal.nodo_id == nodo_id, NodoLocal.validado == True).first()
    db_pg.close()

    if not nodo:
        raise Exception(f"Nodo {nodo_id} no válido o no registrado")

    return client[ip_a_nombre_base(nodo.ip_registrada)]

def ip_a_nombre_base(ip: str) -> str:
    if ip == "190.10.10.1":
        return "NodoLocalSanJose"
    elif ip == "190.10.10.2":
        return "NodoLocalAlajuela"
    elif ip == "192.168.1.10":
        return "NodoLocalSanCarlos"
    else:
        raise Exception(f"No se reconoce una base Mongo para la IP {ip}")
