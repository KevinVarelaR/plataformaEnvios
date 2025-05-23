# app/utils/db_selector.py
from motor.motor_asyncio import AsyncIOMotorClient
from backend.app.nodoCentral.config import NODOS_CONFIG

def get_mongo_db_and_ip(nodo: str):
    nodo = nodo.lower()
    if nodo not in NODOS_CONFIG:
        raise ValueError("Nodo inválido")
    
    mongo_url = NODOS_CONFIG[nodo]["mongo_url"]
    ip = NODOS_CONFIG[nodo]["ip"]
    db = AsyncIOMotorClient(mongo_url).get_default_database()
    return db, ip
