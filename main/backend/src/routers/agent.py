from fastapi import APIRouter, Depends
from pydantic import BaseModel
from agents import Runner, trace
from src.middleware.auth import get_current_user
from src.services.mcp.manager import get_mcp_manager

router = APIRouter(prefix="/api/agent", tags=["agent"])


class ExecuteRequest(BaseModel):
    prompt: str


@router.post("/execute")
async def execute_agent(
    body: ExecuteRequest,
    user: dict = Depends(get_current_user),
):
    manager = get_mcp_manager()
    async with manager.autonomous_agent() as agent:
        with trace("Autonomous agent execution", group_id=user["id"]):
            result = await Runner.run(agent, body.prompt)
        return {"response": result.final_output}


@router.get("/tools")
async def list_tools(
    user: dict = Depends(get_current_user),
):
    from src.services.mcp.registry import get_mcp_registry
    registry = get_mcp_registry()
    return {"connectors": [c.model_dump() for c in registry.list_all()]}
