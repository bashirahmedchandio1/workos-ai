import asyncio
from datetime import datetime, timezone
from celery import Task
from src.worker import celery_app
from src.database import get_session
from src.models.execution import WorkflowRun, ExecutionLog
from src.models.workflow import Workflow
from src.services.workflow.dag import execute_dag
from src.services.workflow.step_resolver import resolve_input_mapping
from agents import Runner, trace
import json


class AsyncTask(Task):
    abstract = True

    def __call__(self, *args, **kwargs):
        loop = asyncio.get_event_loop()
        if loop.is_running():
            return asyncio.ensure_future(self.run_async(*args, **kwargs))
        return asyncio.run(self.run_async(*args, **kwargs))

    async def run_async(self, *args, **kwargs):
        raise NotImplementedError


@celery_app.task(bind=True, base=AsyncTask, max_retries=3)
async def execute_workflow_task(self, run_id: str):
    from src.database import engine
    from sqlmodel import Session

    with Session(engine) as session:
        run = session.get(WorkflowRun, run_id)
        if not run:
            raise ValueError(f"Run {run_id} not found")

        run.status = "running"
        run.started_at = datetime.now(timezone.utc)
        session.add(run)
        session.commit()

        workflow = session.get(Workflow, run.workflow_id)
        if not workflow or not workflow.raw_plan:
            run.status = "failed"
            run.error_message = "No workflow plan found"
            session.add(run)
            session.commit()
            return {"status": "failed", "error": "No workflow plan found"}

        plan = json.loads(workflow.raw_plan)
        steps = plan.get("steps", [])
        trigger = plan.get("trigger")
        if trigger:
            steps = [trigger] + steps
        dependencies = plan.get("dependencies", {})

        from src.services.mcp.manager import get_mcp_manager
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
                    message=f"Executing step: {step.get('label', step['id'])}",
                )
                session.add(log)
                session.commit()

                with trace(f"Step {step['id']}", group_id=run_id):
                    result = await Runner.run(
                        execution_agent,
                        f"Execute step: connector={step['connector_key']}, operation={step.get('operation', '')}, config={json.dumps(resolved_config)}",
                    )

                log = ExecutionLog(
                    workflow_run_id=run_id,
                    step_id=step["id"],
                    level="info",
                    message=f"Step completed: {step.get('label', step['id'])}",
                )
                session.add(log)
                session.commit()

                return {"step_id": step["id"], "output": result.final_output, "status": "completed"}

            try:
                exec_result = await execute_dag(steps, dependencies, execute_step, run.id)
            run.status = exec_result["status"]
            run.completed_at = datetime.now(timezone.utc)
            if exec_result["failed_steps"]:
                run.error_message = json.dumps(exec_result["failed_steps"])
            session.add(run)
            session.commit()
            return exec_result
        except Exception as exc:
            run.status = "failed"
            run.error_message = str(exc)
            session.add(run)
            session.commit()
            raise self.retry(exc=exc, countdown=60)
