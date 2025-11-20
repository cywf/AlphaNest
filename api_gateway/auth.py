"""
Authentication and authorization utilities.
"""

from fastapi import HTTPException, Header, Depends
from typing import Optional
import os
import logging

logger = logging.getLogger(__name__)

# In production, this would be stored in a database
VALID_API_KEYS = set(os.getenv("VALID_API_KEYS", "").split(","))


async def verify_api_key(x_api_key: Optional[str] = Header(None)) -> str:
    """Verify API key from request header.

    Args:
        x_api_key: API key from X-API-Key header

    Returns:
        The verified API key

    Raises:
        HTTPException: If API key is invalid or missing
    """
    if not x_api_key:
        raise HTTPException(
            status_code=401,
            detail="Missing API key. Include X-API-Key header.",
        )

    # In demo mode, allow any key
    if os.getenv("DEMO_MODE", "false").lower() == "true":
        return x_api_key

    if x_api_key not in VALID_API_KEYS:
        raise HTTPException(
            status_code=403,
            detail="Invalid API key",
        )

    return x_api_key


async def optional_api_key(x_api_key: Optional[str] = Header(None)) -> Optional[str]:
    """Optionally verify API key.

    Args:
        x_api_key: API key from X-API-Key header

    Returns:
        The API key if present and valid, None otherwise
    """
    if not x_api_key:
        return None

    try:
        return await verify_api_key(x_api_key)
    except HTTPException:
        return None


def check_membership(api_key: str) -> bool:
    """Check if API key has active membership.

    Args:
        api_key: The API key to check

    Returns:
        True if membership is active, False otherwise
    """
    # In production, check database for membership status
    # For now, just check if key is valid
    return api_key in VALID_API_KEYS


class MembershipRequired:
    """Dependency for endpoints requiring membership."""

    async def __call__(self, api_key: str = Depends(verify_api_key)) -> str:
        """Verify membership is active.

        Args:
            api_key: The verified API key

        Returns:
            The API key if membership is active

        Raises:
            HTTPException: If membership is not active
        """
        if not check_membership(api_key):
            raise HTTPException(
                status_code=402,
                detail="Active membership required. Visit /membership to subscribe.",
            )

        return api_key
