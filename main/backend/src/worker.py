from celery import Celery
from src.config import get_settings

settings = get_settings()

celery_app = Celery(
    "workos_ai",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["src.tasks.execution", "src.tasks.memory"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,
    task_soft_time_limit=3000,
)
