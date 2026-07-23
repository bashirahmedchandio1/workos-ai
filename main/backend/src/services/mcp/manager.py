import os
from contextlib import asynccontextmanager
from agents import Agent
from agents.mcp import MCPServerStdio
from src.services.mcp.registry import get_mcp_registry


HUB_SCRIPT = os.path.join(os.path.dirname(__file__), "..", "..", "connectors", "hub.py")


class MCPManager:
    def __init__(self):
        self._hub_server: MCPServerStdio | None = None

    async def connect_hub(self) -> MCPServerStdio:
        if self._hub_server is not None:
            await self._hub_server.__aexit__(None, None, None)
        server = MCPServerStdio(
            params={
                "command": "python",
                "args": [os.path.abspath(HUB_SCRIPT)],
            }
        )
        await server.__aenter__()
        self._hub_server = server
        return server

    async def disconnect_hub(self):
        if self._hub_server is not None:
            await self._hub_server.__aexit__(None, None, None)
            self._hub_server = None

    @asynccontextmanager
    async def autonomous_agent(self):
        server = await self.connect_hub()
        agent = Agent(
            name="WorkOS AI Agent",
            instructions="""You are a helpful AI assistant that can perform actions across multiple apps.

## Your capabilities
You have access to the following connector tools:
- Gmail: send emails, search emails, download attachments
- Slack: send messages, create channels, upload files
- Google Drive: upload files, create folders, search files
- Google Sheets: append rows, update cells, read data
- Notion: create pages, update pages, append blocks
- Facebook Messenger: send messages, send attachments, get conversations
- Instagram: send DMs, get profiles, get media, comment on posts

## How to operate
1. Listen to the user's request carefully
2. Choose the right tool(s) to fulfill the request
3. Execute them in the correct order if multiple steps are needed
4. Report back what you did and the result
5. If a task needs information you don't have, ask the user

Always confirm what you've done to the user in a friendly, conversational way.""",
            mcp_servers=[server],
        )
        try:
            yield agent
        finally:
            await self.disconnect_hub()

    @asynccontextmanager
    async def executor_agent(self):
        server = await self.connect_hub()
        agent = Agent(
            name="Workflow Executor",
            instructions="""Execute workflow steps by calling the appropriate connector tool.
Given a step description, use the available tools to perform the action.
Report the result of each operation.""",
            mcp_servers=[server],
            output_type=dict,
        )
        try:
            yield agent
        finally:
            await self.disconnect_hub()


_mcp_manager: MCPManager | None = None


def get_mcp_manager() -> MCPManager:
    global _mcp_manager
    if _mcp_manager is None:
        _mcp_manager = MCPManager()
    return _mcp_manager
