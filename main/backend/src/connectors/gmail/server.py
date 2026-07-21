from mcp.server import Server
from mcp.server.models import InitializationOptions
import httpx


mcp = Server("Gmail Connector")


@mcp.tool()
async def send_email(to: str, subject: str, body: str) -> dict:
    """Send an email via Gmail."""
    # In production, this calls the Gmail API with proper auth
    return {"status": "sent", "message_id": "mock_msg_id", "to": to, "subject": subject}


@mcp.tool()
async def search_emails(query: str, max_results: int = 10) -> list[dict]:
    """Search emails in Gmail."""
    return [
        {"id": "msg_1", "subject": "Invoice #123", "from": "vendor@example.com", "snippet": "Please find attached..."}
    ]


@mcp.tool()
async def download_attachment(message_id: str, attachment_id: str) -> dict:
    """Download an email attachment."""
    return {
        "message_id": message_id,
        "attachment_id": attachment_id,
        "filename": "invoice.pdf",
        "content": "base64_encoded_content",
        "mime_type": "application/pdf",
    }
