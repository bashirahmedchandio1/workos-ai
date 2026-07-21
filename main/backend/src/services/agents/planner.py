from agents import Agent, function_tool
from src.services.mcp.registry import get_mcp_registry


@function_tool
async def discover_connectors() -> list[dict]:
    """List all available connectors and their operations for workflow planning."""
    registry = get_mcp_registry()
    return registry.list_tools()


@function_tool
async def get_connector_schema(connector_key: str, operation: str) -> dict:
    """Get the input/output schema for a specific connector operation."""
    registry = get_mcp_registry()
    connector = registry.get_connector(connector_key)
    if not connector:
        return {"error": f"Connector '{connector_key}' not found"}
    for op in connector.operations:
        if op.get("name") == operation:
            return op
    return {"error": f"Operation '{operation}' not found on '{connector_key}'"}


planner_agent = Agent(
    name="Workflow Planner",
    instructions="""
You are a workflow planning specialist for WorkOS AI.

## Your Job
Given a user's natural language request and their context,
produce a structured WorkflowPlan.

## Steps
1. Identify the TRIGGER - what event starts this workflow?
2. Break the request into discrete STEPS (actions + conditions)
3. Assign the correct CONNECTOR to each step
4. Map INPUT/OUTPUT parameters between steps
5. Define DEPENDENCIES (step order + parallel execution)
6. Identify potential WARNINGS (edge cases, missing data)

## Rules
- Each workflow MUST have exactly one trigger
- Steps must form a valid DAG (no circular dependencies)
- Every {{variable}} reference must resolve to a previous step output
- If the user's request is unclear, set clarification_required
- Prefer the user's connected connectors; suggest connecting if missing

## Output Format
Return a JSON object with:
- summary: str - Human-readable summary
- trigger: object - The trigger step with id, type="trigger", label, connector_key, operation, config
- steps: list - Action/condition steps with id, type, label, connector_key, operation, config, input_mapping, depends_on
- dependencies: object - step_id -> list of dependency step_ids
- warnings: list[str] - Edge cases to highlight
- required_connectors: list[str] - Connectors needed
- estimated_duration_seconds: int - Rough estimate
""",
    tools=[discover_connectors, get_connector_schema],
    output_type=dict,
)
