"""
Model Context Protocol (MCP) Server for AlphaNest.

Exposes backend tools and functions for AI agents and ChatKit.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging
import os

from .mcpTools.arbitrage_tools import ArbitrageTools
from .mcpTools.clan_tools import ClanTools
from .mcpTools.wallet_tools import WalletTools
from .mcpTools.naughty_coin_tools import NaughtyCoinTools
from .mcpTools.osint_tools import OSINTTools

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AlphaNest MCP Server",
    description="Model Context Protocol server for AlphaNest backend tools",
    version="1.0.0",
)


# Tool registry
class ToolRegistry:
    """Registry for MCP tools."""

    def __init__(self):
        """Initialize tool registry."""
        self.tools = {
            "arbitrage": ArbitrageTools(),
            "clan": ClanTools(),
            "wallet": WalletTools(),
            "naughty_coin": NaughtyCoinTools(),
            "osint": OSINTTools(),
        }

    def get_tool(self, domain: str):
        """Get tool by domain."""
        return self.tools.get(domain)

    def list_tools(self) -> List[Dict[str, Any]]:
        """List all available tools."""
        all_tools = []
        for domain, tool in self.tools.items():
            all_tools.extend(tool.get_schemas())
        return all_tools


# Global registry
registry = ToolRegistry()


# Request/Response Models


class ToolCallRequest(BaseModel):
    """Tool call request."""

    tool_name: str
    parameters: Dict[str, Any]
    context: Optional[Dict[str, Any]] = None


class ToolCallResponse(BaseModel):
    """Tool call response."""

    tool_name: str
    result: Any
    metadata: Optional[Dict[str, Any]] = None


# Endpoints


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "AlphaNest MCP Server",
        "version": "1.0.0",
        "status": "running",
        "protocol": "MCP/1.0",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "mcp-server",
        "tools_loaded": len(registry.list_tools()),
    }


@app.get("/tools")
async def list_tools():
    """
    List all available tools.

    Returns tool schemas for AI agents.
    """
    return {"tools": registry.list_tools(), "count": len(registry.list_tools())}


@app.get("/tools/{domain}")
async def list_domain_tools(domain: str):
    """
    List tools for a specific domain.

    Args:
        domain: Tool domain (arbitrage, clan, wallet, naughty_coin, osint)
    """
    tool = registry.get_tool(domain)
    if not tool:
        raise HTTPException(status_code=404, detail=f"Domain {domain} not found")

    return {"domain": domain, "tools": tool.get_schemas()}


@app.post("/execute", response_model=ToolCallResponse)
async def execute_tool(request: ToolCallRequest):
    """
    Execute a tool.

    Args:
        request: Tool call request with name and parameters

    Returns:
        Tool execution result
    """
    try:
        # Parse tool name to get domain
        parts = request.tool_name.split(".")
        if len(parts) != 2:
            raise ValueError(f"Invalid tool name format: {request.tool_name}")

        domain, method = parts
        tool = registry.get_tool(domain)

        if not tool:
            raise HTTPException(status_code=404, detail=f"Domain {domain} not found")

        # Execute tool
        result = await tool.execute(method, request.parameters, request.context)

        return ToolCallResponse(
            tool_name=request.tool_name,
            result=result,
            metadata={"domain": domain, "method": method},
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error executing tool: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/introspect")
async def introspect():
    """
    Introspection endpoint for AI agents.

    Returns detailed information about all tools and their capabilities.
    """
    return {
        "server": {
            "name": "AlphaNest MCP Server",
            "version": "1.0.0",
            "protocol": "MCP/1.0",
        },
        "capabilities": {
            "tool_calling": True,
            "streaming": False,
            "context_aware": True,
        },
        "domains": [
            {
                "name": "arbitrage",
                "description": "Cryptocurrency arbitrage analysis tools",
                "tools": registry.get_tool("arbitrage").get_schemas(),
            },
            {
                "name": "clan",
                "description": "Clan Warz game tools",
                "tools": registry.get_tool("clan").get_schemas(),
            },
            {
                "name": "wallet",
                "description": "Blockchain wallet analysis tools",
                "tools": registry.get_tool("wallet").get_schemas(),
            },
            {
                "name": "naughty_coin",
                "description": "Naughty coin detection tools",
                "tools": registry.get_tool("naughty_coin").get_schemas(),
            },
            {
                "name": "osint",
                "description": "OSINT and discovery tools",
                "tools": registry.get_tool("osint").get_schemas(),
            },
        ],
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("MCP_PORT", 8002))
    uvicorn.run(app, host="0.0.0.0", port=port)
