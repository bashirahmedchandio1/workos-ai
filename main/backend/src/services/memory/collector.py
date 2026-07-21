from collections import Counter
from src.services.memory.qdrant_service import QdrantMemoryService


async def refresh_user_memory(
    memory_service: QdrantMemoryService,
    user_id: str,
    workflows: list[dict],
):
    connector_counts: Counter = Counter()
    operation_counts: Counter = Counter()
    trigger_counts: Counter = Counter()

    for wf in workflows:
        plan = wf.get("raw_plan")
        if not plan:
            continue
        if isinstance(plan, str):
            import json
            plan = json.loads(plan)
        trigger = plan.get("trigger", {})
        if trigger:
            key = f"{trigger.get('connector_key', '')}.{trigger.get('operation', '')}"
            trigger_counts[key] += 1
        for step in plan.get("steps", []):
            connector_counts[step.get("connector_key", "")] += 1
            op_key = f"{step.get('connector_key', '')}.{step.get('operation', '')}"
            operation_counts[op_key] += 1

    if connector_counts:
        await memory_service.store_memory(
            user_id,
            "connector_affinity",
            dict(connector_counts.most_common(10)),
            category="pattern",
        )
    if operation_counts:
        await memory_service.store_memory(
            user_id,
            "operation_frequency",
            dict(operation_counts.most_common(20)),
            category="pattern",
        )
    if trigger_counts:
        await memory_service.store_memory(
            user_id,
            "trigger_patterns",
            dict(trigger_counts.most_common(5)),
            category="pattern",
        )
