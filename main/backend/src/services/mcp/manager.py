from agents import Agent
from agents.mcp import MCPServerStdio
from mcp import StdioServerParameters
from src.services.mcp.registry import get_mcp_registry


class MCPManager:
    def __init__(self):
        self._servers: dict[str, MCPServerStdio] = {}

    async def register_connector(self, key: str, command: str, args: list[str] | None = None, env: dict[str, str] | None = None):
        server = MCPServerStdio(
            params=StdioServerParameters(
                command=command,
                args=args or [],
                env=env,
            )
        )
        self._servers[key] = server

    def get_server(self, key: str) -> MCPServerStdio | None:
        return self._servers.get(key)

    def get_servers(self, keys: list[str]) -> list[MCPServerStdio]:
        return [self._servers[k] for k in keys if k in self._servers]

    async def create_agent_with_tools(self, connector_keys: list[str]) -> Agent:
        mcp_servers = self.get_servers(connector_keys)
        return Agent(
            name="Connector Agent",
            instructions="Execute the given step using the available connector tools.",
            mcp_servers=mcp_servers,
        )

    async def discover_tools(self) -> list[dict]:
        registry = get_mcp_registry()
        return registry.list_tools()


_mcp_manager: MCPManager | None = None


def get_mcp_manager() -> MCPManager:
    global _mcp_manager
    if _mcp_manager is None:
        _mcp_manager = MCPManager()
    return _mcp_manager
