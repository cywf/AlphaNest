"""
Market and NFT routes.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import logging
import sys
import os
from datetime import datetime

# Add backend to path for database module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from database import get_db, User, MarketBooth, NFTItem
from ..schemas.market import (
    NFTItemCreate,
    NFTItemResponse,
    MarketBoothCreate,
    MarketBoothUpdate,
    MarketBoothResponse,
)
from ..auth import get_current_user_from_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/market", tags=["marketplace"])


def _booth_to_response(booth: MarketBooth, user: User) -> MarketBoothResponse:
    """Convert booth model to response with user info."""
    response_data = {
        **{k: v for k, v in booth.__dict__.items() if not k.startswith("_")},
        "username": user.username,
        "avatar": user.avatar,
    }
    return MarketBoothResponse(**response_data)


@router.get("/booths", response_model=List[MarketBoothResponse])
async def get_all_booths(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all market booths.
    
    Args:
        skip: Number of booths to skip
        limit: Maximum number of booths to return
        db: Database session
        
    Returns:
        List of market booths
    """
    booths = db.query(MarketBooth).offset(skip).limit(limit).all()
    
    response = []
    for booth in booths:
        user = db.query(User).filter(User.id == booth.user_id).first()
        if user:
            response.append(_booth_to_response(booth, user))
    
    return response


@router.get("/booths/{booth_id}", response_model=MarketBoothResponse)
async def get_booth(booth_id: str, db: Session = Depends(get_db)):
    """Get a specific market booth by ID.
    
    Args:
        booth_id: Booth ID
        db: Database session
        
    Returns:
        Market booth details
        
    Raises:
        HTTPException: If booth not found
    """
    booth = db.query(MarketBooth).filter(MarketBooth.id == booth_id).first()
    
    if not booth:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booth not found"
        )
    
    user = db.query(User).filter(User.id == booth.user_id).first()
    return _booth_to_response(booth, user)


@router.get("/booths/username/{username}", response_model=MarketBoothResponse)
async def get_booth_by_username(username: str, db: Session = Depends(get_db)):
    """Get a market booth by username.
    
    Args:
        username: Username
        db: Database session
        
    Returns:
        Market booth details
        
    Raises:
        HTTPException: If booth not found
    """
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    booth = db.query(MarketBooth).filter(MarketBooth.user_id == user.id).first()
    
    if not booth:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booth not found"
        )
    
    return _booth_to_response(booth, user)


@router.post("/booths", response_model=MarketBoothResponse, status_code=status.HTTP_201_CREATED)
async def create_booth(
    booth_data: MarketBoothCreate,
    authorization: str = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Create a new market booth for authenticated user.
    
    Args:
        booth_data: Booth creation data
        authorization: Authorization header
        db: Database session
        
    Returns:
        Created booth details
        
    Raises:
        HTTPException: If not authenticated or booth already exists
    """
    user = await get_current_user_from_token(authorization, db)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Check if booth already exists
    existing_booth = db.query(MarketBooth).filter(MarketBooth.user_id == user.id).first()
    if existing_booth:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booth already exists for this user"
        )
    
    booth = MarketBooth(
        id=str(uuid.uuid4()),
        user_id=user.id,
        bio=booth_data.bio,
        theme=booth_data.theme,
        layout=booth_data.layout,
    )
    db.add(booth)
    db.commit()
    db.refresh(booth)
    
    logger.info(f"Booth created for user: {user.username}")
    
    return _booth_to_response(booth, user)


@router.patch("/booths/{booth_id}", response_model=MarketBoothResponse)
async def update_booth(
    booth_id: str,
    booth_data: MarketBoothUpdate,
    authorization: str = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Update a market booth.
    
    Args:
        booth_id: Booth ID
        booth_data: Booth update data
        authorization: Authorization header
        db: Database session
        
    Returns:
        Updated booth details
        
    Raises:
        HTTPException: If not authenticated or not authorized
    """
    user = await get_current_user_from_token(authorization, db)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    booth = db.query(MarketBooth).filter(MarketBooth.id == booth_id).first()
    
    if not booth:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booth not found"
        )
    
    if booth.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this booth"
        )
    
    # Update fields
    if booth_data.bio is not None:
        booth.bio = booth_data.bio
    if booth_data.theme is not None:
        booth.theme = booth_data.theme
    if booth_data.layout is not None:
        booth.layout = booth_data.layout
    
    db.commit()
    db.refresh(booth)
    
    return _booth_to_response(booth, user)


@router.post("/nft", response_model=NFTItemResponse, status_code=status.HTTP_201_CREATED)
async def create_nft(
    nft_data: NFTItemCreate,
    authorization: str = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Create a new NFT item.
    
    Args:
        nft_data: NFT creation data
        authorization: Authorization header
        db: Database session
        
    Returns:
        Created NFT details
        
    Raises:
        HTTPException: If not authenticated or booth doesn't exist
    """
    user = await get_current_user_from_token(authorization, db)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Get user's booth
    booth = db.query(MarketBooth).filter(MarketBooth.user_id == user.id).first()
    
    if not booth:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must have a booth to create NFTs"
        )
    
    timestamp = int(datetime.now().timestamp() * 1000)
    nft_id = f"nft_{user.id}_{timestamp}"
    
    nft = NFTItem(
        id=nft_id,
        name=nft_data.name,
        description=nft_data.description,
        image_url=nft_data.image_url,
        price=nft_data.price,
        rarity=nft_data.rarity,
        creator_id=user.id,
        creator=user.username,
        owner_id=user.id,
        booth_id=booth.id,
        featured=nft_data.featured,
        nft_metadata=nft_data.nft_metadata,
        transaction_history=[
            {
                "id": f"tx_{nft_id}",
                "nftId": nft_id,
                "type": "mint",
                "from": "0x0",
                "to": user.id,
                "timestamp": timestamp,
            }
        ],
        created_at=timestamp,
    )
    db.add(nft)
    
    # Update booth stats
    booth.active_listings += 1
    
    db.commit()
    db.refresh(nft)
    
    logger.info(f"NFT created: {nft.name} by {user.username}")
    
    return NFTItemResponse.model_validate(nft)


@router.get("/nft", response_model=List[NFTItemResponse])
async def get_nfts(
    booth_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get NFT items, optionally filtered by booth.
    
    Args:
        booth_id: Optional booth ID to filter by
        skip: Number of items to skip
        limit: Maximum number of items to return
        db: Database session
        
    Returns:
        List of NFT items
    """
    query = db.query(NFTItem)
    
    if booth_id:
        query = query.filter(NFTItem.booth_id == booth_id)
    
    nfts = query.offset(skip).limit(limit).all()
    
    return [NFTItemResponse.model_validate(nft) for nft in nfts]


@router.get("/nft/{nft_id}", response_model=NFTItemResponse)
async def get_nft(nft_id: str, db: Session = Depends(get_db)):
    """Get a specific NFT by ID.
    
    Args:
        nft_id: NFT ID
        db: Database session
        
    Returns:
        NFT details
        
    Raises:
        HTTPException: If NFT not found
    """
    nft = db.query(NFTItem).filter(NFTItem.id == nft_id).first()
    
    if not nft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="NFT not found"
        )
    
    return NFTItemResponse.model_validate(nft)


@router.delete("/nft/{nft_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_nft(
    nft_id: str,
    authorization: str = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Delete an NFT item.
    
    Args:
        nft_id: NFT ID
        authorization: Authorization header
        db: Database session
        
    Raises:
        HTTPException: If not authenticated or not authorized
    """
    user = await get_current_user_from_token(authorization, db)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    nft = db.query(NFTItem).filter(NFTItem.id == nft_id).first()
    
    if not nft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="NFT not found"
        )
    
    if nft.owner_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this NFT"
        )
    
    # Update booth stats
    booth = db.query(MarketBooth).filter(MarketBooth.id == nft.booth_id).first()
    if booth:
        booth.active_listings = max(0, booth.active_listings - 1)
    
    db.delete(nft)
    db.commit()
    
    logger.info(f"NFT deleted: {nft_id} by {user.username}")
