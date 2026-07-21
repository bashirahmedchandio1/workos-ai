import re
from typing import Any


def resolve_input_mapping(
    config: dict[str, Any],
    input_mapping: dict[str, str],
    context: dict[str, dict],
) -> dict[str, Any]:
    resolved = dict(config)

    for field, template in input_mapping.items():
        value = resolve_template(template, context)
        resolved[field] = value

    return resolved


def resolve_template(template: str, context: dict[str, dict]) -> Any:
    pattern = r"\{\{([^}]+)\}\}"
    matches = re.findall(pattern, template)

    if not matches:
        return template

    result = template
    for match in matches:
        parts = match.strip().split(".")
        if len(parts) >= 2:
            step_id = parts[0].strip()
            field_path = parts[1:]
            step_output = context.get(step_id, {}).get("output", {})
            value = step_output
            for field in field_path:
                if isinstance(value, dict):
                    value = value.get(field, "")
                else:
                    value = ""
                    break
            result = result.replace("{{" + match + "}}", str(value))
        else:
            result = result.replace("{{" + match + "}}", "")

    return result
