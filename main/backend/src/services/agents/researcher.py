from agents import Agent, function_tool
from src.services.memory.qdrant_service import QdrantMemoryService


@function_tool
async def query_memory_service(user_id: str, query: str) -> str:
    """Search AI memory for user context relevant to the query."""
    memory = QdrantMemoryService()
    results = await memory.search_memory(user_id, query, limit=10)
    if not results:
        return "No relevant memory found."
    lines = []
    for r in results:
        payload = r.payload
        lines.append(f"- {payload.get('key', 'unknown')}: {payload.get('value', '')}")
    return "\n".join(lines)


@function_tool
async def get_connected_connectors(user_id: str) -> list[str]:
    """Get the list of connectors the user has authenticated."""
    # In production, this queries the oauth_tokens table.
    return ["gmail", "slack", "drive"]


@function_tool
async def get_user_profile(user_id: str) -> dict:
    """Get the user's profile information."""
    return {"user_id": user_id, "name": "User", "organization": "WorkOS"}


researcher_agent = Agent(
    name="Context Researcher",
    instructions="""
You are a research specialist for an AI automation platform.
Your job is to gather context about the user before planning.

## Sources to Check
1. AI Memory (Qdrant) - user preferences, past patterns, corrections
2. Connected connectors - what apps the user has authorized
3. User profile - name, organization, role

## Output
Return a rich context block that the planner can use to make
better decisions. Include:
- Connected connectors list
- Preferred notification channels
- Recently used workflow patterns
- User corrections (what they've fixed in past plans)
""",
    tools=[query_memory_service, get_connected_connectors, get_user_profile],
    output_type=dict,
)
