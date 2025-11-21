"""
Authentication routes for user registration and login.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
import uuid
import logging
import sys
import os

# Add backend to path for database module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from database import get_db, User, Subscription, MarketBooth
from ..schemas.auth import UserCreate, UserLogin, Token, UserResponse
from ..utils.auth_utils import hash_password, verify_password, create_access_token, generate_api_key

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user.
    
    Args:
        user_data: User registration data
        db: Database session
        
    Returns:
        Authentication token and user info
        
    Raises:
        HTTPException: If username or email already exists
    """
    # Check if username exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        id=str(uuid.uuid4()),
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        avatar=user_data.avatar or "👤",
        api_key=generate_api_key(),
        is_active=True,
    )
    db.add(user)
    
    # Create trial subscription
    subscription = Subscription(
        id=str(uuid.uuid4()),
        user_id=user.id,
        status="trial",
        plan_type="monthly",
    )
    db.add(subscription)
    
    # Create market booth
    booth = MarketBooth(
        id=str(uuid.uuid4()),
        user_id=user.id,
        bio=f"Welcome to {user.username}'s Market Booth - Trading digital assets in the neon grid",
        theme="cyan",
        layout="grid",
    )
    db.add(booth)
    
    db.commit()
    db.refresh(user)
    
    logger.info(f"New user registered: {user.username}")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login with username and password.
    
    Args:
        credentials: Login credentials
        db: Database session
        
    Returns:
        Authentication token and user info
        
    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by username
    user = db.query(User).filter(User.username == credentials.username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    logger.info(f"User logged in: {user.username}")
    
    return Token(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    authorization: str = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Get current authenticated user.
    
    Args:
        authorization: Authorization header
        db: Database session
        
    Returns:
        Current user info
        
    Raises:
        HTTPException: If not authenticated
    """
    from ..auth import get_current_user_from_token
    
    user = await get_current_user_from_token(authorization, db)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    return UserResponse.model_validate(user)
