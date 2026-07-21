from functools import lru_cache
from sqlmodel import SQLModel, create_engine, Session
from src.config import get_settings


@lru_cache
def get_engine():
    settings = get_settings()
    return create_engine(settings.database_url, echo=True)


def get_session():
    engine = get_engine()
    with Session(engine) as session:
        yield session


def init_db():
    engine = get_engine()
    SQLModel.metadata.create_all(engine)
