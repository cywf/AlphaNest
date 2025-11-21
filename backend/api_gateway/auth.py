"""
Authentication and authorization utilities.
"""

from fastapi import HTTPException, Header, Depends
from typing import Optional
from sqlalchemy.orm import Session
import sys
import os
import logging

# Add backend to path for database module
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database import get_db, User, Subscription
from .utils.auth_utils import decode_access_token

logger = logging.getLogger(__name__)


async def get_current_user_from_token(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Get current user from JWT token.
    
    Args:
        authorization: Authorization header with Bearer token
        db: Database session
        
    Returns:
        User object if authenticated, None otherwise
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None
    
    token = authorization.split(" ")[1]
    
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        
        if not user_id:
            return None
        
        user = db.query(User).filter(User.id == user_id).first()
        return user
    except HTTPException:
        return None


async def verify_api_key(
    x_api_key: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> str:
    """Verify API key from request header.

    Args:
        x_api_key: API key from X-API-Key header
        db: Database session

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
    
    # Check database for API key
    user = db.query(User).filter(User.api_key == x_api_key).first()
    
    if not user:
        raise HTTPException(
            status_code=403,
            detail="Invalid API key",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive",
        )

    return x_api_key


async def optional_api_key(
    x_api_key: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[str]:
    """Optionally verify API key.

    Args:
        x_api_key: API key from X-API-Key header
        db: Database session

    Returns:
        The API key if present and valid, None otherwise
    """
    if not x_api_key:
        return None

    try:
        return await verify_api_key(x_api_key, db)
    except HTTPException:
        return None


def check_membership(user: User, db: Session) -> bool:
    """Check if user has active membership.

    Args:
        user: User object
        db: Database session

    Returns:
        True if membership is active, False otherwise
    """
    # Check for active subscription
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user.id,
        Subscription.status == "active"
    ).first()
    
    return subscription is not None


class MembershipRequired:
    """Dependency for endpoints requiring membership."""

    async def __call__(
        self,
        x_api_key: Optional[str] = Header(None),
        authorization: Optional[str] = Header(None),
        db: Session = Depends(get_db)
    ) -> User:
        """Verify membership is active.

        Args:
            x_api_key: API key from X-API-Key header
            authorization: Authorization header with Bearer token
            db: Database session

        Returns:
            The user if membership is active

        Raises:
            HTTPException: If membership is not active or user not found
        """
        user = None
        
        # Try to get user from JWT token
        if authorization:
            user = await get_current_user_from_token(authorization, db)
        
        # Try to get user from API key
        if not user and x_api_key:
            user = db.query(User).filter(User.api_key == x_api_key).first()
        
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Authentication required",
            )
        
        if not check_membership(user, db):
            raise HTTPException(
                status_code=402,
                detail="Active membership required. Visit /membership to subscribe.",
            )

        return user

