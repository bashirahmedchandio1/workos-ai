from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from src.database import get_session
from src.models.workflow import Workflow, WorkflowStep
from src.middleware.auth import get_current_user
import json

router = APIRouter(prefix="/api/workflows", tags=["workflows"])


class CreateWorkflowRequest(BaseModel):
    prompt: str
    name: str = ""
    description: str = ""
    approval_required: bool = True
    org_id: str = ""


class UpdateWorkflowRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    approval_required: bool | None = None
    raw_plan: dict | None = None
    canvas_state: dict | None = None


@router.post("")
async def create_workflow(
    body: CreateWorkflowRequest,
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    workflow = Workflow(
        user_id=user["id"],
        org_id=body.org_id,
        name=body.name or body.prompt[:100],
        description=body.description,
        natural_language_prompt=body.prompt,
        approval_required=body.approval_required,
        status="draft",
    )
    session.add(workflow)
    session.commit()
    session.refresh(workflow)
    return workflow


@router.get("")
async def list_workflows(
    org_id: str = "",
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    query = select(Workflow).where(Workflow.user_id == user["id"])
    if org_id:
        query = query.where(Workflow.org_id == org_id)
    query = query.order_by(Workflow.updated_at.desc())
    results = session.exec(query).all()
    return results


@router.get("/{workflow_id}")
async def get_workflow(
    workflow_id: str,
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow


@router.put("/{workflow_id}")
async def update_workflow(
    workflow_id: str,
    body: UpdateWorkflowRequest,
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")

    if body.name is not None:
        workflow.name = body.name
    if body.description is not None:
        workflow.description = body.description
    if body.approval_required is not None:
        workflow.approval_required = body.approval_required
    if body.raw_plan is not None:
        workflow.raw_plan = json.dumps(body.raw_plan)
    if body.canvas_state is not None:
        workflow.canvas_state = json.dumps(body.canvas_state)

    session.add(workflow)
    session.commit()
    session.refresh(workflow)
    return workflow


@router.delete("/{workflow_id}")
async def delete_workflow(
    workflow_id: str,
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    session.delete(workflow)
    session.commit()
    return {"status": "deleted"}


@router.post("/{workflow_id}/approve")
async def approve_workflow(
    workflow_id: str,
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return {"status": "approved", "workflow_id": workflow_id}


@router.post("/{workflow_id}/reject")
async def reject_workflow(
    workflow_id: str,
    comment: str = "",
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return {"status": "rejected", "workflow_id": workflow_id}
