from pymongo import MongoClient
from app.nodoLocal.config import MONGO_URL
from app.servidorCentral.database.centralPG import SessionLocal
from app.servidorCentral.models.nodo import NodoLocal

client = MongoClient(MONGO_URL)

def get_mongo_db_por_nodo(nodo_id: int):
    """
    Obtiene la base de datos MongoDB correspondiente a un nodo validado.

    Args:
        nodo_id (int): ID del nodo local.

    Returns:
        Database: Objeto de base de datos MongoDB correspondiente al nodo.

    Raises:
        Exception: Si el nodo no es válido o no está registrado.
    """
    db_pg = SessionLocal()
    nodo = db_pg.query(NodoLocal).filter(NodoLocal.nodo_id == nodo_id, NodoLocal.validado == True).first()
    db_pg.close()

    if not nodo:
        raise Exception(f"Nodo {nodo_id} no válido o no registrado")

    return client[ip_a_nombre_base(nodo.ip_registrada)]

def ip_a_nombre_base(ip: str) -> str:
    """
    Convierte una dirección IP en el nombre de la base de datos MongoDB correspondiente.

    Args:
        ip (str): Dirección IP del nodo.

    Returns:
        str: Nombre de la base de datos MongoDB.

    Raises:
        Exception: Si la IP no corresponde a ninguna base conocida.
    """
    if ip == "190.10.10.1":
        return "NodoLocalSanJose"
    elif ip == "190.10.10.2":
        return "NodoLocalAlajuela"
    elif ip == "192.168.1.10":
        return "NodoLocalSanCarlos"
    else:
        raise Exception(f"No se reconoce una base Mongo para la IP {ip}")
    
def get_entrega_collection(nodo_id: int):
    """
    Obtiene la colección 'entregas' de la base de datos MongoDB correspondiente a un nodo validado.

    Args:
        nodo_id (int): ID del nodo local.

    Returns:
        Collection: Colección 'entregas' de la base de datos MongoDB.

    Raises:
        Exception: Si el nodo no es encontrado o no está validado.
    """
    db_pg = SessionLocal()
    nodo = db_pg.query(NodoLocal).filter_by(nodo_id=nodo_id, validado=True).first()
    db_pg.close()

    if not nodo:
        raise Exception("Nodo no encontrado o no validado.")

    base_mongo = nodo.nombre.replace(" ", "")
    cliente = MongoClient(MONGO_URL)
    return cliente[base_mongo]["entregas"]

