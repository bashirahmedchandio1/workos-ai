from mcp.server import Server


mcp = Server("Slack Connector")


@mcp.tool()
async def send_message(channel: str, text: str) -> dict:
    """Send a message to a Slack channel."""
    return {"status": "sent", "channel": channel, "timestamp": "mock_ts"}


@mcp.tool()
async def create_channel(name: str, is_private: bool = False) -> dict:
    """Create a new Slack channel."""
    return {"status": "created", "name": name, "id": "mock_channel_id"}


@mcp.tool()
async def upload_file(channel: str, file_content: str, filename: str) -> dict:
    """Upload a file to Slack."""
    return {"status": "uploaded", "channel": channel, "filename": filename, "url": "https://mock.slack.com/file/1"}
