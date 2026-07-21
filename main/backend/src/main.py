from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config import get_settings
from src.database import init_db
from src.routers import planner, workflows, execution, memory, admin, connectors

settings = get_settings()


app = FastAPI(
    title="WorkOS AI Backend",
    description="AI-Native Automation Platform Backend API",
    version="0.1.0",
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


@app.get("/")
async def root():
    return {
        "service": "WorkOS AI Backend",
        "version": "0.1.0",
        "status": "running",
    }
