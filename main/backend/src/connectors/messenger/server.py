from mcp.server import Server

mcp = Server("Messenger Connector")


@mcp.tool()
async def send_message(recipient_id: str, text: str) -> dict:
    """Send a Facebook Messenger message to a user."""
    return {"status": "sent", "recipient_id": recipient_id, "message_id": "mock_messenger_msg_id"}


@mcp.tool()
async def send_attachment(recipient_id: str, attachment_url: str, attachment_type: str = "image") -> dict:
    """Send an attachment (image, video, file) via Facebook Messenger."""
    return {"status": "sent", "recipient_id": recipient_id, "attachment_type": attachment_type, "attachment_url": attachment_url}


@mcp.tool()
async def get_conversations(limit: int = 20) -> list[dict]:
    """Get recent Facebook Messenger conversations."""
    return [
        {"id": "conv_1", "participants": ["user_1", "user_2"], "last_message": "Hey, are you coming?", "unread_count": 2},
        {"id": "conv_2", "participants": ["user_1", "user_3"], "last_message": "Thanks for the update!", "unread_count": 0},
    ]
