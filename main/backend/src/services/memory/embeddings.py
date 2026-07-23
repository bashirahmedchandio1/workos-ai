from functools import lru_cache
from openai import AsyncOpenAI
from src.config import get_settings


@lru_cache
def get_embedding_client() -> AsyncOpenAI:
    settings = get_settings()
    return AsyncOpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=settings.openrouter_api_key,
    )


async def generate_embedding(text: str, model: str = "openai/text-embedding-3-small") -> list[float]:
    client = get_embedding_client()
    response = await client.embeddings.create(
        model=model,
        input=text,
    )
    return response.data[0].embedding
