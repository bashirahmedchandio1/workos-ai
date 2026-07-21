from pydantic import BaseModel
from typing import Any
from datetime import datetime


class UserContext(BaseModel):
    user_id: str
    org_id: str
    prompt: str
    workflow_id: str | None = None


class ExecutionContext(BaseModel):
    run_id: str
    plan: dict[str, Any]
    user_id: str
    org_id: str
    auth_tokens: dict[str, str] = {}
    start_time: datetime | None = None
    max_retries: int = 3


class PlannerResponse(BaseModel):
    type: str = "plan"
    plan: dict[str, Any] | None = None
    questions: list[dict[str, Any]] | None = None
    error: str | None = None


class SafetyVerdict(BaseModel):
    verdict: str = "allow"
    reason: str = ""


class ValidationResult(BaseModel):
    is_valid: bool = True
    errors: list[str] = []


class StepResult(BaseModel):
    step_id: str
    status: str = "completed"
    output: dict[str, Any] = {}
    error: str | None = None
    duration_ms: int = 0


class ExecutionResult(BaseModel):
    status: str = "completed"
    completed_steps: dict[str, Any] = {}
    failed_steps: dict[str, str] = {}
