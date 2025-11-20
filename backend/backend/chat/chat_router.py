"""
Chat router for AI chat endpoints.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import logging

from .chat_service import ChatService
from .conversation_store import ConversationStore

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["chat"])

# Global instances
_chat_service: Optional[ChatService] = None
_conversation_store: Optional[ConversationStore] = None


def get_chat_service() -> ChatService:
    """Get or create chat service instance."""
    global _chat_service
    if _chat_service is None:
        _chat_service = ChatService()
    return _chat_service


def get_conversation_store() -> ConversationStore:
    """Get or create conversation store instance."""
    global _conversation_store
    if _conversation_store is None:
        _conversation_store = ConversationStore()
    return _conversation_store


# Request/Response Models


class MessageRequest(BaseModel):
    """Chat message request."""

    conversation_id: Optional[str] = None
    user_id: str
    message: str
    tools: Optional[List[str]] = None
    stream: bool = False


class ToolRequest(BaseModel):
    """Tool execution request."""

    tool_name: str
    parameters: Dict[str, Any]
    user_id: str


class MessageResponse(BaseModel):
    """Chat message response."""

    conversation_id: str
    message_id: str
    role: str
    content: str
    tools_used: List[str]
    timestamp: str


# Endpoints


@router.post("/message", response_model=MessageResponse)
async def send_message(
    request: MessageRequest,
    chat_service: ChatService = Depends(get_chat_service),
    conversation_store: ConversationStore = Depends(get_conversation_store),
):
    """
    Send a message to the AI chat.

    Supports:
    - Function calling
    - Tool execution
    - Streaming responses
    """
    try:
        # Create or get conversation
        if not request.conversation_id:
            conversation = await conversation_store.create_conversation(
                user_id=request.user_id
            )
            conversation_id = conversation["conversation_id"]
        else:
            conversation_id = request.conversation_id

        # Process message
        response = await chat_service.create_message(
            conversation_id=conversation_id,
            user_id=request.user_id,
            message=request.message,
            tools=request.tools,
            stream=request.stream,
        )

        # Store message and response
        await conversation_store.add_message(
            conversation_id=conversation_id, role="user", content=request.message
        )
        await conversation_store.add_message(
            conversation_id=conversation_id,
            role="assistant",
            content=response["content"],
        )

        return MessageResponse(**response)

    except Exception as e:
        logger.error(f"Error processing message: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tools")
async def execute_tool(
    request: ToolRequest, chat_service: ChatService = Depends(get_chat_service)
):
    """
    Execute a chat tool/function.

    Available tools:
    - arbitrage_lookup: Find arbitrage opportunities
    - clan_score_lookup: Get Clan Warz scores
    - osint_coin_discovery: Discover new coins
    - scam_wallet_dossier: Analyze suspicious wallets
    - shop_theme_generator: Generate shop themes
    - user_onboarding_help: Onboarding assistance
    """
    try:
        result = await chat_service.execute_tool(
            tool_name=request.tool_name, parameters=request.parameters
        )
        return result

    except Exception as e:
        logger.error(f"Error executing tool: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conversation/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    user_id: str,
    conversation_store: ConversationStore = Depends(get_conversation_store),
):
    """
    Get conversation history.

    Returns all messages in a conversation with permissions check.
    """
    try:
        conversation = await conversation_store.get_conversation(
            conversation_id=conversation_id, user_id=user_id
        )

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        return conversation

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching conversation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conversations")
async def list_conversations(
    user_id: str,
    limit: int = 20,
    conversation_store: ConversationStore = Depends(get_conversation_store),
):
    """List all conversations for a user."""
    try:
        conversations = await conversation_store.list_conversations(
            user_id=user_id, limit=limit
        )
        return {"conversations": conversations}

    except Exception as e:
        logger.error(f"Error listing conversations: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
