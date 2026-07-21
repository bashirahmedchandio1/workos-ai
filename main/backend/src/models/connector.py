import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column, JSON, TEXT, Boolean
from typing import Optional


class ConnectorDefinition(SQLModel, table=True):
    __tablename__ = "connector_definitions"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    key: str = Field(default="", unique=True, index=True)
    name: str = Field(default="")
    description: str = Field(default="", sa_type=TEXT)
    auth_type: str = Field(default="oauth2")
    icon_url: str = Field(default="")
    is_active: bool = Field(default=True, sa_type=Boolean)


class OAuthToken(SQLModel, table=True):
    __tablename__ = "oauth_tokens"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(default="", index=True)
    org_id: str = Field(default="", index=True)
    connector_id: str = Field(default="", foreign_key="connector_definitions.id")
    access_token: str = Field(default="", sa_type=TEXT)
    refresh_token: str = Field(default="", sa_type=TEXT)
    token_type: str = Field(default="Bearer")
    expires_at: Optional[datetime] = Field(default=None)
    scopes: str = Field(default="", sa_type=TEXT)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
