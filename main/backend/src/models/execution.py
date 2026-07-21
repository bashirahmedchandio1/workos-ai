import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column, JSON, TEXT, Integer
from typing import Optional


class WorkflowRun(SQLModel, table=True):
    __tablename__ = "workflow_runs"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    workflow_id: str = Field(default="", index=True, foreign_key="workflows.id")
    user_id: str = Field(default="", index=True)
    org_id: str = Field(default="", index=True)
    triggered_by: str = Field(default="user")
    status: str = Field(default="pending")
    started_at: Optional[datetime] = Field(default=None)
    completed_at: Optional[datetime] = Field(default=None)
    error_message: str = Field(default="", sa_type=TEXT)


class ExecutionLog(SQLModel, table=True):
    __tablename__ = "execution_logs"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    workflow_run_id: str = Field(
        default="", index=True, foreign_key="workflow_runs.id"
    )
    step_id: str = Field(default="")
    level: str = Field(default="info")
    message: str = Field(default="", sa_type=TEXT)
    log_metadata: str = Field(default="{}", sa_type=JSON, alias="metadata")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class Approval(SQLModel, table=True):
    __tablename__ = "approvals"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    workflow_run_id: str = Field(
        default="", index=True, foreign_key="workflow_runs.id"
    )
    workflow_id: str = Field(default="", foreign_key="workflows.id")
    requested_by: str = Field(default="")
    approved_by: Optional[str] = Field(default=None)
    status: str = Field(default="pending")
    comment: str = Field(default="", sa_type=TEXT)
    requested_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    decided_at: Optional[datetime] = Field(default=None)
