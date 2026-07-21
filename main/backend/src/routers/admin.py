from fastapi import APIRouter, Depends
from src.middleware.auth import get_current_user
from src.services.mcp.registry import get_mcp_registry

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "WorkOS AI Backend",
    }


@router.get("/connectors/discover")
async def discover_connectors(user: dict = Depends(get_current_user)):
    registry = get_mcp_registry()
    return {"connectors": [c.model_dump() for c in registry.list_all()]}
