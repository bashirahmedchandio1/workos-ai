import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column, JSON, TEXT, Boolean, Integer
from typing import Optional


class Workflow(SQLModel, table=True):
    __tablename__ = "workflows"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    org_id: str = Field(default="", index=True)
    user_id: str = Field(default="", index=True)
    name: str = Field(default="")
    description: str = Field(default="", sa_type=TEXT)
    natural_language_prompt: str = Field(default="", sa_type=TEXT)
    raw_plan: Optional[str] = Field(default=None, sa_type=JSON)
    status: str = Field(default="draft")
    approval_required: bool = Field(default=True, sa_type=Boolean)
    canvas_state: Optional[str] = Field(default=None, sa_type=JSON)
    source_template_id: Optional[str] = Field(default=None)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class WorkflowStep(SQLModel, table=True):
    __tablename__ = "workflow_steps"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    workflow_id: str = Field(default="", index=True, foreign_key="workflows.id")
    step_order: int = Field(default=0, sa_type=Integer)
    step_type: str = Field(default="action")
    connector_key: str = Field(default="")
    operation: str = Field(default="")
    config: str = Field(default="{}", sa_type=JSON)
    depends_on: str = Field(default="[]", sa_type=JSON)
    input_mapping: str = Field(default="{}", sa_type=JSON)
    output_mapping: str = Field(default="{}", sa_type=JSON)
    retry_count: int = Field(default=0, sa_type=Integer)
    max_retries: int = Field(default=3, sa_type=Integer)
    status: str = Field(default="pending")
