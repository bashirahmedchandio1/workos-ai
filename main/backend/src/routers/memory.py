from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from src.middleware.auth import get_current_user
from src.services.memory.qdrant_service import QdrantMemoryService

router = APIRouter(prefix="/api/memory", tags=["memory"])


class MemorySettings(BaseModel):
    memory_enabled: bool = True


memory_service = QdrantMemoryService()


@router.get("")
async def list_memory(user: dict = Depends(get_current_user)):
    ctx = await memory_service.get_user_context(user["id"])
    return {"context": ctx}


@router.get("/search")
async def search_memory(
    q: str = "",
    user: dict = Depends(get_current_user),
):
    results = await memory_service.search_memory(user["id"], q)
    return {"results": [{"key": r.payload.get("key"), "value": r.payload.get("value"), "score": r.score} for r in results]}


@router.delete("/{key}")
async def delete_memory(
    key: str,
    user: dict = Depends(get_current_user),
):
    await memory_service.delete_memory(user["id"], key)
    return {"status": "deleted", "key": key}


@router.delete("")
async def wipe_memory(user: dict = Depends(get_current_user)):
    await memory_service.wipe_memory(user["id"])
    return {"status": "wiped"}


@router.put("/settings")
async def update_memory_settings(
    body: MemorySettings,
    user: dict = Depends(get_current_user),
):
    await memory_service.store_memory(
        user["id"],
        "memory_settings",
        {"memory_enabled": body.memory_enabled},
        category="preference",
    )
    return {"status": "updated", "memory_enabled": body.memory_enabled}
