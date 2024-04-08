from config.db import conn
from fastapi import APIRouter, HTTPException, status, Depends
from schemas.material import materialEntity, materialsEntity

material = APIRouter(prefix="/material")

materials_collection = conn["users"]["materials"]

@material.get("/all-materials", status_code=status.HTTP_200_OK)
async def get_all_materials():
    materials = materialsEntity(materials_collection.find())

    if not materials:
        raise HTTPException(status_code=404, detail= "No Material")

    return materials


