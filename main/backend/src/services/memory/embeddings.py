from functools import lru_cache
from openai import AsyncOpenAI
from src.config import get_settings


@lru_cache
def get_openai_client() -> AsyncOpenAI:
    settings = get_settings()
    return AsyncOpenAI(api_key=settings.openai_api_key)


async def generate_embedding(text: str, model: str = "text-embedding-3-small") -> list[float]:
    client = get_openai_client()
    response = await client.embeddings.create(
        model=model,
        input=text,
    )
    return response.data[0].embedding
