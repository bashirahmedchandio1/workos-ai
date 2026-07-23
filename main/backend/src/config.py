from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql://workos:workos@localhost:5432/workos_ai"
    redis_url: str = "redis://localhost:6379/0"
    openrouter_api_key: str = ""
    openrouter_model: str = "openrouter/free"
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str = ""
    clerk_jwks_url: str = ""
    clerk_publishable_key: str = ""
    cors_origins: str = "http://localhost:3000"
    environment: str = "development"
    log_level: str = "DEBUG"
    api_prefix: str = "/api"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
