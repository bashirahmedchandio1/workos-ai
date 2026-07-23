from mcp.server import Server

mcp = Server("Instagram Connector")


@mcp.tool()
async def send_dm(recipient_id: str, text: str) -> dict:
    """Send an Instagram Direct Message to a user."""
    return {"status": "sent", "recipient_id": recipient_id, "message_id": "mock_instagram_msg_id"}


@mcp.tool()
async def get_profile_info(username: str) -> dict:
    """Get public profile information for an Instagram user."""
    return {
        "username": username,
        "full_name": f"{username} Name",
        "follower_count": 1234,
        "following_count": 567,
        "is_verified": False,
    }


@mcp.tool()
async def get_recent_media(username: str, limit: int = 10) -> list[dict]:
    """Get recent media posts from an Instagram user."""
    return [{"id": "media_1", "type": "image", "caption": "My latest post!", "like_count": 42, "comment_count": 5}]


@mcp.tool()
async def comment_on_post(media_id: str, text: str) -> dict:
    """Comment on an Instagram post."""
    return {"status": "commented", "media_id": media_id, "comment_id": "mock_comment_id"}
