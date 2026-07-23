from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from agents import set_default_openai_client, set_default_openai_api, set_tracing_disabled
from src.config import get_settings
from src.database import init_db
from src.routers import planner, workflows, execution, memory, admin, connectors, agent
from src.services.mcp.registry import get_mcp_registry
from loguru import logger


settings = get_settings()

set_default_openai_api("chat_completions")
set_tracing_disabled(True)

if settings.openrouter_api_key:
    openrouter_client = AsyncOpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=settings.openrouter_api_key,
    )
    set_default_openai_client(openrouter_client, use_for_tracing=False)
    logger.info(f"OpenRouter configured: model={settings.openrouter_model}")
else:
    logger.warning("OPENROUTER_API_KEY not set — Agents SDK will fail at runtime")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting WorkOS AI Backend...")
    try:
        init_db()
        logger.info("Database tables initialized")
    except Exception as e:
        logger.warning(f"Database init skipped: {e}")
    registry = get_mcp_registry()
    logger.info(f"Loaded {len(registry.list_all())} connectors into registry")
    yield
    logger.info("Shutting down WorkOS AI Backend")


app = FastAPI(
    title="WorkOS AI Backend",
    description="AI-Native Automation Platform Backend API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(planner.router)
app.include_router(workflows.router)
app.include_router(execution.router)
app.include_router(memory.router)
app.include_router(admin.router)
app.include_router(connectors.router)
app.include_router(agent.router)


@app.get("/")
async def root():
    return {
        "service": "WorkOS AI Backend",
        "version": "0.1.0",
        "status": "running",
        "connectors_loaded": len(get_mcp_registry().list_all()),
    }
