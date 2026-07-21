from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from src.database import get_session
from src.models.connector import ConnectorDefinition, OAuthToken
from src.middleware.auth import get_current_user
from src.services.mcp.registry import get_mcp_registry

router = APIRouter(prefix="/api/connectors", tags=["connectors"])


@router.get("")
async def list_connectors():
    registry = get_mcp_registry()
    return {"connectors": [c.model_dump() for c in registry.list_all()]}


@router.get("/{key}")
async def get_connector(key: str):
    registry = get_mcp_registry()
    connector = registry.get_connector(key)
    if not connector:
        raise HTTPException(status_code=404, detail="Connector not found")
    return connector.model_dump()


@router.get("/connected")
async def list_connected(
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    query = select(OAuthToken).where(OAuthToken.user_id == user["id"])
    tokens = session.exec(query).all()
    return {"connected": [t.connector_id for t in tokens]}
