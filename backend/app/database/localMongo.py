from pymongo import MongoClient
from app.config import MONGO_URL

client = MongoClient(MONGO_URL)
mongo_db = client["nodo_local_bd2"]  # Nombre de la base en MongoDB

paquetes_collection = mongo_db["paquetes"]
rutas_collection = mongo_db["rutas"]
vehiculos_collection = mongo_db["vehiculos"]
entregas_collection = mongo_db["entregas"]
