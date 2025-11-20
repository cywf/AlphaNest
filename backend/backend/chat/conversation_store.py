"""
Conversation storage using Supabase.
"""

import os
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)


class ConversationStore:
    """Store and retrieve conversations from Supabase."""

    def __init__(self):
        """Initialize conversation store."""
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase credentials not set, using in-memory storage")
            self.in_memory_store = {}
        else:
            # In production, initialize Supabase client
            self.in_memory_store = {}

    async def create_conversation(
        self, user_id: str, metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create a new conversation.

        Args:
            user_id: User identifier
            metadata: Optional conversation metadata

        Returns:
            Created conversation
        """
        conversation_id = str(uuid.uuid4())
        conversation = {
            "conversation_id": conversation_id,
            "user_id": user_id,
            "messages": [],
            "metadata": metadata or {},
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }

        self.in_memory_store[conversation_id] = conversation
        logger.info(f"Created conversation {conversation_id} for user {user_id}")

        return conversation

    async def get_conversation(
        self, conversation_id: str, user_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get a conversation by ID.

        Args:
            conversation_id: Conversation identifier
            user_id: User identifier for permission check

        Returns:
            Conversation data or None
        """
        conversation = self.in_memory_store.get(conversation_id)

        if conversation and conversation["user_id"] == user_id:
            return conversation

        return None

    async def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Add a message to a conversation.

        Args:
            conversation_id: Conversation identifier
            role: Message role (user/assistant/system)
            content: Message content
            metadata: Optional message metadata

        Returns:
            Added message
        """
        conversation = self.in_memory_store.get(conversation_id)
        if not conversation:
            raise ValueError(f"Conversation {conversation_id} not found")

        message = {
            "message_id": str(uuid.uuid4()),
            "role": role,
            "content": content,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow().isoformat(),
        }

        conversation["messages"].append(message)
        conversation["updated_at"] = datetime.utcnow().isoformat()

        logger.info(f"Added message to conversation {conversation_id}")

        return message

    async def list_conversations(
        self, user_id: str, limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        List conversations for a user.

        Args:
            user_id: User identifier
            limit: Maximum number of conversations to return

        Returns:
            List of conversations
        """
        user_conversations = [
            conv for conv in self.in_memory_store.values() if conv["user_id"] == user_id
        ]

        # Sort by updated_at descending
        user_conversations.sort(key=lambda x: x["updated_at"], reverse=True)

        return user_conversations[:limit]

    async def delete_conversation(self, conversation_id: str, user_id: str) -> bool:
        """
        Delete a conversation.

        Args:
            conversation_id: Conversation identifier
            user_id: User identifier for permission check

        Returns:
            True if deleted, False otherwise
        """
        conversation = self.in_memory_store.get(conversation_id)

        if conversation and conversation["user_id"] == user_id:
            del self.in_memory_store[conversation_id]
            logger.info(f"Deleted conversation {conversation_id}")
            return True

        return False
