"""Market and NFT schemas."""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class NFTItemCreate(BaseModel):
    """Schema for creating an NFT item."""
    
    name: str = Field(..., min_length=1, max_length=255)
    description: str = ""
    image_url: str = "🎨"
    price: float = Field(..., gt=0)
    rarity: str = Field(default="common", pattern="^(common|rare|epic|legendary)$")
    featured: bool = False
    nft_metadata: Dict[str, Any] = {}


class NFTItemResponse(BaseModel):
    """Schema for NFT item response."""
    
    id: str
    name: str
    description: str
    image_url: str
    price: float
    rarity: str
    creator_id: str
    creator: str
    owner_id: str
    booth_id: str
    featured: bool
    views: int
    favorites: int
    sales: int
    nft_metadata: Dict[str, Any]
    transaction_history: List[Dict[str, Any]]
    created_at: int
    
    class Config:
        from_attributes = True


class MarketBoothCreate(BaseModel):
    """Schema for creating a market booth."""
    
    bio: str = ""
    theme: str = Field(default="cyan", pattern="^(cyan|magenta|gold|glitch)$")
    layout: str = Field(default="grid", pattern="^(grid|gallery|terminal)$")


class MarketBoothUpdate(BaseModel):
    """Schema for updating a market booth."""
    
    bio: Optional[str] = None
    theme: Optional[str] = Field(None, pattern="^(cyan|magenta|gold|glitch)$")
    layout: Optional[str] = Field(None, pattern="^(grid|gallery|terminal)$")


class MarketBoothResponse(BaseModel):
    """Schema for market booth response."""
    
    id: str
    user_id: str
    username: str
    avatar: str
    bio: str
    theme: str
    layout: str
    popularity: int
    reputation: int
    total_sales: int
    total_volume: float
    items_sold: int
    active_listings: int
    total_views: int
    created_at: datetime
    updated_at: Optional[datetime]
    listings: List[NFTItemResponse] = []
    
    class Config:
        from_attributes = True
