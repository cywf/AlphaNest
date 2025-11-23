"""SQLAlchemy models for AlphaNest database."""

from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    JSON,
    BigInteger,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import uuid

from .db import Base


class User(Base):
    """User account model."""

    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    stripe_customer_id = Column(String(255), unique=True, nullable=True)
    api_key = Column(String(255), unique=True, nullable=True, index=True)
    avatar = Column(String(10), default="👤")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    subscriptions = relationship(
        "Subscription", back_populates="user", cascade="all, delete-orphan"
    )
    trades = relationship("Trade", back_populates="user", cascade="all, delete-orphan")
    booth = relationship(
        "MarketBooth",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    nfts = relationship("NFTItem", back_populates="owner", cascade="all, delete-orphan")


class Subscription(Base):
    """User subscription/membership model."""

    __tablename__ = "subscriptions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    status = Column(String(50), default="trial")  # trial, active, cancelled, expired
    plan_type = Column(String(50), default="monthly")  # monthly, annual
    stripe_subscription_id = Column(String(255), unique=True, nullable=True)
    next_billing_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="subscriptions")


class Trade(Base):
    """Arbitrage trade/opportunity record."""

    __tablename__ = "trades"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    pair = Column(String(50), nullable=False)
    buy_exchange = Column(String(100), nullable=False)
    sell_exchange = Column(String(100), nullable=False)
    buy_price = Column(Float, nullable=False)
    sell_price = Column(Float, nullable=False)
    profit_amount = Column(Float, nullable=False)
    profit_percentage = Column(Float, nullable=False)
    executed = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="trades")


class MarketBooth(Base):
    """NFT marketplace booth model."""

    __tablename__ = "market_booths"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    bio = Column(Text, default="")
    theme = Column(String(50), default="cyan")  # cyan, magenta, gold, glitch
    layout = Column(String(50), default="grid")  # grid, gallery, terminal

    # Stats
    popularity = Column(Integer, default=0)
    reputation = Column(Integer, default=0)
    total_sales = Column(Integer, default=0)
    total_volume = Column(Float, default=0.0)
    items_sold = Column(Integer, default=0)
    active_listings = Column(Integer, default=0)
    total_views = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="booth")
    listings = relationship(
        "NFTItem", back_populates="booth", cascade="all, delete-orphan"
    )


class NFTItem(Base):
    """NFT item model."""

    __tablename__ = "nft_items"

    id = Column(String(50), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    image_url = Column(String(10), default="🎨")
    price = Column(Float, nullable=False)
    rarity = Column(String(50), default="common")  # common, rare, epic, legendary

    creator_id = Column(String(36), nullable=False)
    creator = Column(String(100), nullable=False)
    owner_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    booth_id = Column(
        String(36), ForeignKey("market_booths.id", ondelete="CASCADE"), nullable=False
    )

    featured = Column(Boolean, default=False)

    # Stats
    views = Column(Integer, default=0)
    favorites = Column(Integer, default=0)
    sales = Column(Integer, default=0)

    # NFT attributes and transaction history as JSON
    nft_attributes = Column(JSON, default={})
    transaction_history = Column(JSON, default=[])

    created_at = Column(BigInteger, nullable=False)  # Timestamp in milliseconds

    # Relationships
    owner = relationship("User", back_populates="nfts")
    booth = relationship("MarketBooth", back_populates="listings")
