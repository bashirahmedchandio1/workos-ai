.PHONY: dev dev-worker install clean

install:
	uv sync

dev:
	uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

dev-worker:
	uv run celery -A src.worker.celery_app worker --loglevel=info

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name '*.pyc' -delete
