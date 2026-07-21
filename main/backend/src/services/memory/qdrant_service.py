from datetime import datetime, timezone
from qdrant_client import AsyncQdrantClient, models
from src.config import get_settings
from src.services.memory.embeddings import generate_embedding

settings = get_settings()


class QdrantMemoryService:
    def __init__(self):
        self.client = AsyncQdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key or None,
        )

    async def ensure_collection(self, user_id: str):
        collection_name = f"memory_user_{user_id}"
        if not await self.client.collection_exists(collection_name):
            await self.client.create_collection(
                collection_name=collection_name,
                vectors_config=models.VectorParams(
                    size=1536,
                    distance=models.Distance.COSINE,
                ),
            )

    async def store_memory(
        self,
        user_id: str,
        key: str,
        value: dict,
        category: str = "preference",
    ):
        collection_name = f"memory_user_{user_id}"
        await self.ensure_collection(user_id)
        embedding = await generate_embedding(str(value))
        point_id = abs(hash(f"{key}_{user_id}")) % (2**63)
        await self.client.upsert(
            collection_name=collection_name,
            points=[
                models.PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload={
                        "key": key,
                        "value": value,
                        "category": category,
                        "created_at": datetime.now(timezone.utc).isoformat(),
                    },
                )
            ],
        )

    async def search_memory(
        self,
        user_id: str,
        query: str,
        category: str | None = None,
        limit: int = 10,
    ):
        collection_name = f"memory_user_{user_id}"
        if not await self.client.collection_exists(collection_name):
            return []

        query_vector = await generate_embedding(query)
        filter_conditions = []
        if category:
            filter_conditions.append(
                models.FieldCondition(
                    key="category",
                    match=models.MatchValue(value=category),
                )
            )

        results = await self.client.query_points(
            collection_name=collection_name,
            query=query_vector,
            query_filter=models.Filter(must=filter_conditions) if filter_conditions else None,
            limit=limit,
            with_payload=True,
        )
        return results.points

    async def get_user_context(self, user_id: str) -> str:
        recent = await self.search_memory(user_id, "recent", limit=5)
        preferences = await self.search_memory(
            user_id, "preference", category="preference", limit=10
        )
        parts = []
        if preferences:
            parts.append("--- User Preferences (from memory) ---")
            for p in preferences:
                payload = p.payload
                parts.append(f"- {payload.get('key', 'unknown')}: {payload.get('value', '')}")
        if recent:
            parts.append("--- Recent Activity ---")
            for r in recent:
                payload = r.payload
                parts.append(f"- {payload.get('key', 'unknown')}: {payload.get('value', '')}")
        return "\n".join(parts) if parts else "No memory context available."

    async def delete_memory(self, user_id: str, key: str):
        collection_name = f"memory_user_{user_id}"
        if not await self.client.collection_exists(collection_name):
            return
        await self.client.delete(
            collection_name=collection_name,
            points_selector=models.FilterSelector(
                filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="key",
                            match=models.MatchValue(value=key),
                        )
                    ]
                )
            ),
        )

    async def wipe_memory(self, user_id: str):
        collection_name = f"memory_user_{user_id}"
        if await self.client.collection_exists(collection_name):
            await self.client.delete_collection(collection_name)
