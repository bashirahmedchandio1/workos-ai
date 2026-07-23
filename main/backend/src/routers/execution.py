from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from sqlmodel import Session, select
from src.database import get_session
from src.models.execution import WorkflowRun, ExecutionLog, Approval
from src.models.workflow import Workflow
from src.middleware.auth import get_current_user
from src.services.workflow.dag import execute_dag
from src.services.workflow.step_resolver import resolve_input_mapping
from agents import Runner, trace
from src.services.mcp.manager import get_mcp_manager
from datetime import datetime, timezone
import json
import asyncio

router = APIRouter(prefix="/api", tags=["execution"])


class ExecuteRequest(BaseModel):
    workflow_id: str


class StepExecuteRequest(BaseModel):
    step_id: str
    config: dict = {}


@router.post("/workflows/{workflow_id}/execute")
async def execute_workflow(
    workflow_id: str,
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")

    run = WorkflowRun(
        workflow_id=workflow_id,
        user_id=user["id"],
        org_id=workflow.org_id,
        status="pending_approval" if workflow.approval_required else "pending",
    )
    session.add(run)
    session.commit()
    session.refresh(run)

    if not workflow.approval_required:
        run.status = "running"
        run.started_at = datetime.now(timezone.utc)
        session.add(run)
        session.commit()

        plan = json.loads(workflow.raw_plan) if workflow.raw_plan else {}
        steps = plan.get("steps", [])
        trigger = plan.get("trigger")
        if trigger:
            steps = [trigger] + steps
        dependencies = plan.get("dependencies", {})

        manager = get_mcp_manager()
        async with manager.executor_agent() as execution_agent:
            async def execute_step(step: dict, context: dict, run_id: str):
                step_config = step.get("config", {})
                input_mapping = step.get("input_mapping", {})
                resolved_config = resolve_input_mapping(step_config, input_mapping, context)

                log = ExecutionLog(
                    workflow_run_id=run_id,
                    step_id=step["id"],
                    level="info",
                    message=f"Executing step: {step.get('label', step['id'])} on {step['connector_key']}",
                )
                session.add(log)
                session.commit()

                with trace(f"Step {step['id']}", group_id=run_id):
                    result = await Runner.run(
                        execution_agent,
                        f"Execute step {step.get('label', step['id'])}: connector={step['connector_key']}, operation={step.get('operation', '')}, config={json.dumps(resolved_config)}",
                    )

                output = result.final_output
                log = ExecutionLog(
                    workflow_run_id=run_id,
                    step_id=step["id"],
                    level="info",
                    message=f"Step completed: {step.get('label', step['id'])}",
                    metadata=json.dumps({"output": str(output)}),
                )
                session.add(log)
                session.commit()

                return {"step_id": step["id"], "output": output, "status": "completed"}

            exec_result = await execute_dag(steps, dependencies, execute_step, run.id)

        run.status = exec_result["status"]
        run.completed_at = datetime.now(timezone.utc)
        if exec_result["failed_steps"]:
            run.error_message = json.dumps(exec_result["failed_steps"])
        session.add(run)
        session.commit()

    return {"run_id": run.id, "status": run.status}


@router.get("/workflow-runs")
async def list_runs(
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    query = (
        select(WorkflowRun)
        .where(WorkflowRun.user_id == user["id"])
        .order_by(WorkflowRun.started_at.desc())
    )
    results = session.exec(query).all()
    return results


@router.get("/workflow-runs/{run_id}")
async def get_run(
    run_id: str,
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    run = session.get(WorkflowRun, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run


@router.get("/workflow-runs/{run_id}/logs")
async def get_run_logs(
    run_id: str,
    user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    query = (
        select(ExecutionLog)
        .where(ExecutionLog.workflow_run_id == run_id)
        .order_by(ExecutionLog.timestamp)
    )
    results = session.exec(query).all()
    return results


@router.websocket("/ws/workflow-runs/{run_id}")
async def workflow_run_ws(websocket: WebSocket, run_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({
                "type": "log",
                "data": {"run_id": run_id, "message": "Connected to log stream"},
            })
    except WebSocketDisconnect:
        pass
