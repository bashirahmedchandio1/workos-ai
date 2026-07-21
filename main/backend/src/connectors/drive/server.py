from mcp.server import Server


mcp = Server("Google Drive Connector")


@mcp.tool()
async def upload_file(name: str, content: str, folder_id: str = "root") -> dict:
    """Upload a file to Google Drive."""
    return {"status": "uploaded", "file_id": "mock_drive_file_id", "name": name, "folder_id": folder_id}


@mcp.tool()
async def create_folder(name: str, parent_id: str = "root") -> dict:
    """Create a new folder in Google Drive."""
    return {"status": "created", "folder_id": "mock_folder_id", "name": name}


@mcp.tool()
async def search_files(query: str, max_results: int = 10) -> list[dict]:
    """Search for files in Google Drive."""
    return [{"id": "file_1", "name": "Invoice.pdf", "mime_type": "application/pdf"}]
