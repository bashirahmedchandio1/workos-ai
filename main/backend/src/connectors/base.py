from mcp.server import Server


def create_mcp_server(name: str) -> Server:
    return Server(name)
