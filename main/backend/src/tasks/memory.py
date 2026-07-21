import asyncio
from collections import Counter
from celery import Task
from src.worker import celery_app
from src.database import engine
from sqlmodel import Session, select
from src.models.workflow import Workflow
from src.services.memory.qdrant_service import QdrantMemoryService
from src.services.memory.collector import refresh_user_memory
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


@celery_app.task(base=AsyncTask)
async def refresh_memory_for_user(user_id: str):
    memory_service = QdrantMemoryService()

    with Session(engine) as session:
        query = (
            select(Workflow)
            .where(Workflow.user_id == user_id)
            .order_by(Workflow.updated_at.desc())
            .limit(50)
        )
        workflows = session.exec(query).all()
        workflow_dicts = [
            {
                "raw_plan": w.raw_plan,
                "status": w.status,
            }
            for w in workflows
        ]

    await refresh_user_memory(memory_service, user_id, workflow_dicts)
    return {"status": "completed", "user_id": user_id}


@celery_app.task(base=AsyncTask)
async def daily_memory_refresh():
    with Session(engine) as session:
        query = select(Workflow.user_id).distinct()
        user_ids = session.exec(query).all()

    for uid in user_ids:
        await refresh_memory_for_user.delay(uid)

    return {"status": "completed", "users_processed": len(user_ids)}
