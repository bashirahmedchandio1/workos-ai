from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from agents import Runner, trace
from src.services.agents.orchestrator import orchestrator_agent
from src.middleware.auth import get_current_user

router = APIRouter(prefix="/api/planner", tags=["planner"])


class GenerateRequest(BaseModel):
    prompt: str
    workflow_id: str | None = None


class RefineRequest(BaseModel):
    workflow_id: str
    answers: dict[str, str]


@router.post("/generate")
async def generate_plan(
    body: GenerateRequest,
    user: dict = Depends(get_current_user),
):
    context = {
        "user_id": user["id"],
        "org_id": "",
        "prompt": body.prompt,
        "workflow_id": body.workflow_id,
    }

    with trace("Generate workflow plan", group_id=user["id"]):
        result = await Runner.run(
            orchestrator_agent,
            body.prompt,
            context=context,
        )

    response = result.final_output

    if isinstance(response, dict) and response.get("type") == "plan":
        return {"plan_id": id(response), "plan": response.get("plan"), "warnings": response.get("plan", {}).get("warnings", [])}

    if isinstance(response, dict) and response.get("type") == "clarification_required":
        return {"clarification_required": True, "questions": response.get("questions", [])}

    error_msg = "Plan generation failed"
    if isinstance(response, dict):
        error_msg = response.get("error", error_msg)
    raise HTTPException(status_code=400, detail=error_msg)


@router.post("/refine")
async def refine_plan(
    body: RefineRequest,
    user: dict = Depends(get_current_user),
):
    context = {
        "user_id": user["id"],
        "org_id": "",
        "prompt": "",
        "workflow_id": body.workflow_id,
    }

    with trace("Refine workflow plan", group_id=user["id"]):
        result = await Runner.run(
            orchestrator_agent,
            f"Refine the workflow plan with these clarifications: {body.answers}",
            context=context,
        )

    response = result.final_output
    if isinstance(response, dict) and response.get("type") == "plan":
        return {"plan_id": id(response), "plan": response.get("plan")}

    raise HTTPException(status_code=400, detail="Failed to refine plan")
