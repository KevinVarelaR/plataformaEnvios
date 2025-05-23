from app.nodoLocal.database.localMongo import mongo_db
from bson import ObjectId

# Devuelve una colección filtrada por la IP del nodo
async def get_items_by_ip(collection_name: str, ip_nodo: str):
    collection = mongo_db[collection_name]
    return await collection.find({"ip_nodo": ip_nodo}).to_list(length=None)

# Inserta un documento asignando ip_nodo automáticamente
async def insert_with_ip(collection_name: str, data: dict, ip_nodo: str):
    data["ip_nodo"] = ip_nodo
    result = await mongo_db[collection_name].insert_one(data)
    return str(result.inserted_id)

# Actualiza un documento por ID y IP
async def update_item_by_ip(collection_name: str, item_id: str, update_data: dict, ip_nodo: str):
    collection = mongo_db[collection_name]
    result = await collection.update_one(
        {"_id": item_id, "ip_nodo": ip_nodo},
        {"$set": update_data}
    )
    return result.modified_count

async def find_one_by_field(collection_name: str, field: str, value: str, ip_nodo: str):
    collection = mongo_db[collection_name]
    return await collection.find_one({field: value, "ip_nodo": ip_nodo})


# Elimina todos los documentos de un nodo (por IP, si se desea)
async def delete_all_by_ip(collection_name: str, ip_nodo: str):
    collection = mongo_db[collection_name]
    result = await collection.delete_many({"ip_nodo": ip_nodo})
    return result.deleted_count
