from pydantic import BaseModel
from typing import Any


class ConnectorInfo(BaseModel):
    key: str
    name: str
    operations: list[dict[str, Any]]


class MCPRegistry:
    def __init__(self):
        self._connectors: dict[str, ConnectorInfo] = {}

    def register(self, info: ConnectorInfo):
        self._connectors[info.key] = info

    def get_connector(self, key: str) -> ConnectorInfo | None:
        return self._connectors.get(key)

    def has_connector(self, key: str) -> bool:
        return key in self._connectors

    def has_operation(self, connector_key: str, operation: str) -> bool:
        connector = self._connectors.get(connector_key)
        if not connector:
            return False
        return any(op.get("name") == operation for op in connector.operations)

    def list_all(self) -> list[ConnectorInfo]:
        return list(self._connectors.values())

    def list_tools(self) -> list[dict[str, Any]]:
        tools = []
        for conn in self._connectors.values():
            for op in conn.operations:
                tools.append({
                    "connector": conn.key,
                    "name": op.get("name"),
                    "description": op.get("description", ""),
                    "input_schema": op.get("input_schema", {}),
                })
        return tools


_registry: MCPRegistry | None = None


def get_mcp_registry() -> MCPRegistry:
    global _registry
    if _registry is None:
        _registry = MCPRegistry()
        _register_default_connectors(_registry)
    return _registry


def _register_default_connectors(registry: MCPRegistry):
    registry.register(ConnectorInfo(
        key="gmail",
        name="Gmail",
        operations=[
            {"name": "new_email", "description": "Trigger when a new email arrives", "input_schema": {"type": "object", "properties": {"query": {"type": "string"}}}},
            {"name": "send_email", "description": "Send an email", "input_schema": {"type": "object", "properties": {"to": {"type": "string"}, "subject": {"type": "string"}, "body": {"type": "string"}}, "required": ["to", "subject", "body"]}},
            {"name": "search_emails", "description": "Search emails", "input_schema": {"type": "object", "properties": {"query": {"type": "string"}, "max_results": {"type": "integer"}}}},
            {"name": "download_attachment", "description": "Download an email attachment", "input_schema": {"type": "object", "properties": {"message_id": {"type": "string"}, "attachment_id": {"type": "string"}}}},
        ],
    ))
    registry.register(ConnectorInfo(
        key="slack",
        name="Slack",
        operations=[
            {"name": "send_message", "description": "Send a message to a Slack channel", "input_schema": {"type": "object", "properties": {"channel": {"type": "string"}, "text": {"type": "string"}}, "required": ["channel", "text"]}},
            {"name": "create_channel", "description": "Create a new Slack channel", "input_schema": {"type": "object", "properties": {"name": {"type": "string"}, "is_private": {"type": "boolean"}}}},
            {"name": "upload_file", "description": "Upload a file to Slack", "input_schema": {"type": "object", "properties": {"channel": {"type": "string"}, "file_content": {"type": "string"}, "filename": {"type": "string"}}}},
        ],
    ))
    registry.register(ConnectorInfo(
        key="drive",
        name="Google Drive",
        operations=[
            {"name": "upload_file", "description": "Upload a file to Google Drive", "input_schema": {"type": "object", "properties": {"name": {"type": "string"}, "content": {"type": "string"}, "folder_id": {"type": "string"}}}},
            {"name": "create_folder", "description": "Create a new folder", "input_schema": {"type": "object", "properties": {"name": {"type": "string"}, "parent_id": {"type": "string"}}}},
            {"name": "search_files", "description": "Search for files", "input_schema": {"type": "object", "properties": {"query": {"type": "string"}, "max_results": {"type": "integer"}}}},
        ],
    ))
    registry.register(ConnectorInfo(
        key="sheets",
        name="Google Sheets",
        operations=[
            {"name": "append_row", "description": "Append a row to a sheet", "input_schema": {"type": "object", "properties": {"spreadsheet_id": {"type": "string"}, "range": {"type": "string"}, "values": {"type": "array", "items": {"type": "array"}}}}},
            {"name": "update_cell", "description": "Update a cell value", "input_schema": {"type": "object", "properties": {"spreadsheet_id": {"type": "string"}, "range": {"type": "string"}, "value": {"type": "string"}}}},
            {"name": "get_sheet_data", "description": "Read data from a sheet", "input_schema": {"type": "object", "properties": {"spreadsheet_id": {"type": "string"}, "range": {"type": "string"}}}},
        ],
    ))
    registry.register(ConnectorInfo(
        key="notion",
        name="Notion",
        operations=[
            {"name": "create_page", "description": "Create a new Notion page", "input_schema": {"type": "object", "properties": {"database_id": {"type": "string"}, "title": {"type": "string"}, "content": {"type": "string"}}}},
            {"name": "update_page", "description": "Update a Notion page", "input_schema": {"type": "object", "properties": {"page_id": {"type": "string"}, "properties": {"type": "object"}}}},
            {"name": "append_block", "description": "Append content block to a Notion page", "input_schema": {"type": "object", "properties": {"page_id": {"type": "string"}, "block_type": {"type": "string"}, "content": {"type": "string"}}}},
        ],
    ))
