from mcp.server import Server
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
import anyio

mcp = Server("WorkOS AI Connector Hub")

# ── Gmail ──────────────────────────────────────────────

@mcp.tool()
async def gmail_send_email(to: str, subject: str, body: str) -> dict:
    """Send an email via Gmail."""
    return {"status": "sent", "message_id": "mock_msg_id", "to": to, "subject": subject}


@mcp.tool()
async def gmail_search_emails(query: str, max_results: int = 10) -> list[dict]:
    """Search emails in Gmail."""
    return [{"id": "msg_1", "subject": "Invoice #123", "from": "vendor@example.com", "snippet": "Please find attached..."}]


@mcp.tool()
async def gmail_download_attachment(message_id: str, attachment_id: str) -> dict:
    """Download an email attachment."""
    return {"message_id": message_id, "attachment_id": attachment_id, "filename": "invoice.pdf", "content": "base64_encoded_content", "mime_type": "application/pdf"}

# ── Slack ──────────────────────────────────────────────

@mcp.tool()
async def slack_send_message(channel: str, text: str) -> dict:
    """Send a message to a Slack channel."""
    return {"status": "sent", "channel": channel, "timestamp": "mock_ts"}


@mcp.tool()
async def slack_create_channel(name: str, is_private: bool = False) -> dict:
    """Create a new Slack channel."""
    return {"status": "created", "name": name, "id": "mock_channel_id"}


@mcp.tool()
async def slack_upload_file(channel: str, file_content: str, filename: str) -> dict:
    """Upload a file to Slack."""
    return {"status": "uploaded", "channel": channel, "filename": filename, "url": "https://mock.slack.com/file/1"}

# ── Google Drive ───────────────────────────────────────

@mcp.tool()
async def drive_upload_file(name: str, content: str, folder_id: str = "root") -> dict:
    """Upload a file to Google Drive."""
    return {"status": "uploaded", "file_id": "mock_drive_file_id", "name": name, "folder_id": folder_id}


@mcp.tool()
async def drive_create_folder(name: str, parent_id: str = "root") -> dict:
    """Create a new folder in Google Drive."""
    return {"status": "created", "folder_id": "mock_folder_id", "name": name}


@mcp.tool()
async def drive_search_files(query: str, max_results: int = 10) -> list[dict]:
    """Search for files in Google Drive."""
    return [{"id": "file_1", "name": "Invoice.pdf", "mime_type": "application/pdf"}]

# ── Google Sheets ──────────────────────────────────────

@mcp.tool()
async def sheets_append_row(spreadsheet_id: str, range: str, values: list[list]) -> dict:
    """Append a row to a Google Sheet."""
    return {"status": "appended", "spreadsheet_id": spreadsheet_id, "range": range, "updated_rows": 1}


@mcp.tool()
async def sheets_update_cell(spreadsheet_id: str, range: str, value: str) -> dict:
    """Update a cell value in a Google Sheet."""
    return {"status": "updated", "spreadsheet_id": spreadsheet_id, "range": range}


@mcp.tool()
async def sheets_get_data(spreadsheet_id: str, range: str) -> dict:
    """Read data from a Google Sheet."""
    return {"spreadsheet_id": spreadsheet_id, "range": range, "values": [["Header1", "Header2"], ["val1", "val2"]]}

# ── Notion ─────────────────────────────────────────────

@mcp.tool()
async def notion_create_page(database_id: str, title: str, content: str = "") -> dict:
    """Create a new Notion page in a database."""
    return {"status": "created", "page_id": "mock_notion_page_id", "title": title, "url": "https://notion.so/mock"}


@mcp.tool()
async def notion_update_page(page_id: str, properties: dict) -> dict:
    """Update a Notion page's properties."""
    return {"status": "updated", "page_id": page_id}


@mcp.tool()
async def notion_append_block(page_id: str, block_type: str, content: str) -> dict:
    """Append a content block to a Notion page."""
    return {"status": "appended", "page_id": page_id, "block_type": block_type}

# ── Facebook Messenger ─────────────────────────────────

@mcp.tool()
async def messenger_send_message(recipient_id: str, text: str) -> dict:
    """Send a Facebook Messenger message to a user."""
    return {"status": "sent", "recipient_id": recipient_id, "message_id": "mock_messenger_msg_id"}


@mcp.tool()
async def messenger_send_attachment(recipient_id: str, attachment_url: str, attachment_type: str = "image") -> dict:
    """Send an attachment (image, video, file) via Facebook Messenger."""
    return {"status": "sent", "recipient_id": recipient_id, "attachment_type": attachment_type, "attachment_url": attachment_url}


@mcp.tool()
async def messenger_get_conversations(limit: int = 20) -> list[dict]:
    """Get recent Facebook Messenger conversations."""
    return [{"id": "conv_1", "participants": ["user_1", "user_2"], "last_message": "Hey, are you coming?", "unread_count": 2}]

# ── Instagram ──────────────────────────────────────────

@mcp.tool()
async def instagram_send_dm(recipient_id: str, text: str) -> dict:
    """Send an Instagram Direct Message to a user."""
    return {"status": "sent", "recipient_id": recipient_id, "message_id": "mock_instagram_msg_id"}


@mcp.tool()
async def instagram_get_profile(username: str) -> dict:
    """Get public profile information for an Instagram user."""
    return {"username": username, "full_name": f"{username} Name", "follower_count": 1234, "following_count": 567, "is_verified": False}


@mcp.tool()
async def instagram_get_media(username: str, limit: int = 10) -> list[dict]:
    """Get recent media posts from an Instagram user."""
    return [{"id": "media_1", "type": "image", "caption": "My latest post!", "like_count": 42, "comment_count": 5}]


@mcp.tool()
async def instagram_comment(media_id: str, text: str) -> dict:
    """Comment on an Instagram post."""
    return {"status": "commented", "media_id": media_id, "comment_id": "mock_comment_id"}


if __name__ == "__main__":
    async def main():
        async with stdio_server() as (read_stream, write_stream):
            await mcp.run(read_stream, write_stream, InitializationOptions(server_name="WorkOS AI Connector Hub"))
    anyio.run(main)
