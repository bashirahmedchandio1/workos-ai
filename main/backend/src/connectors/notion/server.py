from mcp.server import Server


mcp = Server("Notion Connector")


@mcp.tool()
async def create_page(database_id: str, title: str, content: str = "") -> dict:
    """Create a new Notion page in a database."""
    return {"status": "created", "page_id": "mock_notion_page_id", "title": title, "url": "https://notion.so/mock"}


@mcp.tool()
async def update_page(page_id: str, properties: dict) -> dict:
    """Update a Notion page's properties."""
    return {"status": "updated", "page_id": page_id}


@mcp.tool()
async def append_block(page_id: str, block_type: str, content: str) -> dict:
    """Append a content block to a Notion page."""
    return {"status": "appended", "page_id": page_id, "block_type": block_type}
