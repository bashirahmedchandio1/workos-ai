from collections import defaultdict
from datetime import datetime, timezone


class DAGValidationError(Exception):
    pass


def validate_dag(steps: list[dict], dependencies: dict[str, list[str]]):
    step_ids = {s["id"] for s in steps}

    for step_id, dep_ids in dependencies.items():
        if step_id not in step_ids:
            raise DAGValidationError(f"Step '{step_id}' in dependencies not found in steps")
        for dep_id in dep_ids:
            if dep_id not in step_ids:
                raise DAGValidationError(f"Dependency '{dep_id}' for step '{step_id}' not found")

    visited: set[str] = set()
    rec_stack: set[str] = set()

    def has_cycle(node: str) -> bool:
        visited.add(node)
        rec_stack.add(node)
        for dep in dependencies.get(node, []):
            if dep not in visited:
                if has_cycle(dep):
                    return True
            elif dep in rec_stack:
                return True
        rec_stack.discard(node)
        return False

    for step_id in step_ids:
        if step_id not in visited:
            if has_cycle(step_id):
                raise DAGValidationError("Circular dependency detected")


class DAG:
    def __init__(self, steps: list[dict], dependencies: dict[str, list[str]]):
        self.steps = {s["id"]: s for s in steps}
        self.dependencies = dependencies
        self._dependents: dict[str, list[str]] = defaultdict(list)
        for step_id, deps in dependencies.items():
            for dep in deps:
                self._dependents[dep].append(step_id)

    def get_ready_batches(self, completed: set[str], failed: set[str]) -> list[list[dict]]:
        ready = [
            self.steps[s_id]
            for s_id in self.steps
            if s_id not in completed and s_id not in failed
            and all(dep in completed for dep in self.dependencies.get(s_id, []))
        ]
        # Sort by step_order if available
        ready.sort(key=lambda s: s.get("step_order", 0))
        return [ready]


async def execute_dag(
    steps: list[dict],
    dependencies: dict[str, list[str]],
    execute_fn,
    run_id: str,
):
    dag = DAG(steps, dependencies)
    completed: dict[str, dict] = {}
    failed: dict[str, str] = {}
    all_step_ids = {s["id"] for s in steps}

    while len(completed) + len(failed) < len(all_step_ids):
        batches = dag.get_ready_batches(set(completed.keys()), set(failed.keys()))
        if not batches or not batches[0]:
            if len(completed) + len(failed) < len(all_step_ids):
                stalled = all_step_ids - set(completed.keys()) - set(failed.keys())
                for sid in stalled:
                    failed[sid] = "Dependencies cannot be satisfied (stalled)"
            break

        for batch in batches:
            import asyncio
            results = await asyncio.gather(
                *[execute_fn(s, completed, run_id) for s in batch],
                return_exceptions=True,
            )
            for step, result in zip(batch, results):
                if isinstance(result, Exception):
                    failed[step["id"]] = str(result)
                else:
                    completed[step["id"]] = result

    return {
        "status": "completed" if not failed else "completed_with_errors" if completed else "failed",
        "completed_steps": completed,
        "failed_steps": failed,
    }
