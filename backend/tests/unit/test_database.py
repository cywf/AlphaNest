"""Tests for database models and operations."""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os
from datetime import datetime

# Add parent directories to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from database import Base, User, Subscription, Trade, MarketBooth, NFTItem
from api_gateway.utils.auth_utils import (
    hash_password,
    verify_password,
    generate_api_key,
)


# Create in-memory SQLite database for testing
TEST_DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture
def db_engine():
    """Create test database engine."""
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session(db_engine):
    """Create test database session."""
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    session = TestSessionLocal()
    yield session
    session.close()


class TestUserModel:
    """Tests for User model."""

    def test_create_user(self, db_session):
        """Test creating a user."""
        user = User(
            id="test-user-1",
            username="testuser",
            email="test@example.com",
            hashed_password=hash_password("password123"),
            api_key=generate_api_key(),
            is_active=True,
        )
        db_session.add(user)
        db_session.commit()

        # Query user
        retrieved_user = (
            db_session.query(User).filter(User.username == "testuser").first()
        )

        assert retrieved_user is not None
        assert retrieved_user.username == "testuser"
        assert retrieved_user.email == "test@example.com"
        assert retrieved_user.is_active is True
        assert verify_password("password123", retrieved_user.hashed_password)

    def test_unique_username(self, db_session):
        """Test that username must be unique."""
        user1 = User(
            id="test-user-1",
            username="testuser",
            email="test1@example.com",
            hashed_password=hash_password("password123"),
        )
        db_session.add(user1)
        db_session.commit()

        # Try to create another user with same username
        user2 = User(
            id="test-user-2",
            username="testuser",
            email="test2@example.com",
            hashed_password=hash_password("password456"),
        )
        db_session.add(user2)

        with pytest.raises(Exception):  # Should raise integrity error
            db_session.commit()

    def test_unique_email(self, db_session):
        """Test that email must be unique."""
        user1 = User(
            id="test-user-1",
            username="testuser1",
            email="test@example.com",
            hashed_password=hash_password("password123"),
        )
        db_session.add(user1)
        db_session.commit()

        # Try to create another user with same email
        user2 = User(
            id="test-user-2",
            username="testuser2",
            email="test@example.com",
            hashed_password=hash_password("password456"),
        )
        db_session.add(user2)

        with pytest.raises(Exception):  # Should raise integrity error
            db_session.commit()


class TestSubscriptionModel:
    """Tests for Subscription model."""

    def test_create_subscription(self, db_session):
        """Test creating a subscription."""
        # Create user first
        user = User(
            id="test-user-1",
            username="testuser",
            email="test@example.com",
            hashed_password=hash_password("password123"),
        )
        db_session.add(user)
        db_session.commit()

        # Create subscription
        subscription = Subscription(
            id="test-sub-1",
            user_id=user.id,
            status="active",
            plan_type="monthly",
        )
        db_session.add(subscription)
        db_session.commit()

        # Query subscription
        retrieved_sub = (
            db_session.query(Subscription)
            .filter(Subscription.user_id == user.id)
            .first()
        )

        assert retrieved_sub is not None
        assert retrieved_sub.status == "active"
        assert retrieved_sub.plan_type == "monthly"

    def test_subscription_user_relationship(self, db_session):
        """Test subscription-user relationship."""
        user = User(
            id="test-user-1",
            username="testuser",
            email="test@example.com",
            hashed_password=hash_password("password123"),
        )
        db_session.add(user)

        subscription = Subscription(
            id="test-sub-1",
            user_id=user.id,
            status="active",
            plan_type="monthly",
        )
        db_session.add(subscription)
        db_session.commit()

        # Access subscription through user
        assert len(user.subscriptions) == 1
        assert user.subscriptions[0].status == "active"


class TestTradeModel:
    """Tests for Trade model."""

    def test_create_trade(self, db_session):
        """Test creating a trade record."""
        user = User(
            id="test-user-1",
            username="testuser",
            email="test@example.com",
            hashed_password=hash_password("password123"),
        )
        db_session.add(user)
        db_session.commit()

        trade = Trade(
            id="test-trade-1",
            user_id=user.id,
            pair="BTC-USD",
            buy_exchange="Binance",
            sell_exchange="Coinbase",
            buy_price=50000.0,
            sell_price=50500.0,
            profit_amount=500.0,
            profit_percentage=1.0,
            executed=True,
        )
        db_session.add(trade)
        db_session.commit()

        retrieved_trade = (
            db_session.query(Trade).filter(Trade.id == "test-trade-1").first()
        )

        assert retrieved_trade is not None
        assert retrieved_trade.pair == "BTC-USD"
        assert retrieved_trade.profit_amount == 500.0
        assert retrieved_trade.executed is True


class TestMarketBoothModel:
    """Tests for MarketBooth model."""

    def test_create_booth(self, db_session):
        """Test creating a market booth."""
        user = User(
            id="test-user-1",
            username="testuser",
            email="test@example.com",
            hashed_password=hash_password("password123"),
        )
        db_session.add(user)
        db_session.commit()

        booth = MarketBooth(
            id="test-booth-1",
            user_id=user.id,
            bio="Test booth",
            theme="cyan",
            layout="grid",
            popularity=50,
            reputation=75,
        )
        db_session.add(booth)
        db_session.commit()

        retrieved_booth = (
            db_session.query(MarketBooth).filter(MarketBooth.user_id == user.id).first()
        )

        assert retrieved_booth is not None
        assert retrieved_booth.bio == "Test booth"
        assert retrieved_booth.theme == "cyan"
        assert retrieved_booth.popularity == 50

    def test_one_booth_per_user(self, db_session):
        """Test that each user can only have one booth."""
        user = User(
            id="test-user-1",
            username="testuser",
            email="test@example.com",
            hashed_password=hash_password("password123"),
        )
        db_session.add(user)
        db_session.commit()

        booth1 = MarketBooth(
            id="test-booth-1",
            user_id=user.id,
            bio="First booth",
        )
        db_session.add(booth1)
        db_session.commit()

        # Try to create another booth for same user
        booth2 = MarketBooth(
            id="test-booth-2",
            user_id=user.id,
            bio="Second booth",
        )
        db_session.add(booth2)

        with pytest.raises(Exception):  # Should raise integrity error
            db_session.commit()


class TestNFTItemModel:
    """Tests for NFTItem model."""

    def test_create_nft(self, db_session):
        """Test creating an NFT item."""
        user = User(
            id="test-user-1",
            username="testuser",
            email="test@example.com",
            hashed_password=hash_password("password123"),
        )
        db_session.add(user)

        booth = MarketBooth(
            id="test-booth-1",
            user_id=user.id,
        )
        db_session.add(booth)
        db_session.commit()

        nft = NFTItem(
            id="test-nft-1",
            name="Test NFT",
            description="A test NFT",
            image_url="🎨",
            price=100.0,
            rarity="rare",
            creator_id=user.id,
            creator=user.username,
            owner_id=user.id,
            booth_id=booth.id,
            featured=True,
            nft_attributes={"collection": "TestCollection"},
            transaction_history=[],
            created_at=int(datetime.now().timestamp() * 1000),
        )
        db_session.add(nft)
        db_session.commit()

        retrieved_nft = (
            db_session.query(NFTItem).filter(NFTItem.id == "test-nft-1").first()
        )

        assert retrieved_nft is not None
        assert retrieved_nft.name == "Test NFT"
        assert retrieved_nft.price == 100.0
        assert retrieved_nft.rarity == "rare"
        assert retrieved_nft.featured is True

    def test_nft_relationships(self, db_session):
        """Test NFT relationships with user and booth."""
        user = User(
            id="test-user-1",
            username="testuser",
            email="test@example.com",
            hashed_password=hash_password("password123"),
        )
        db_session.add(user)

        booth = MarketBooth(
            id="test-booth-1",
            user_id=user.id,
        )
        db_session.add(booth)
        db_session.commit()

        nft = NFTItem(
            id="test-nft-1",
            name="Test NFT",
            price=100.0,
            creator_id=user.id,
            creator=user.username,
            owner_id=user.id,
            booth_id=booth.id,
            created_at=int(datetime.now().timestamp() * 1000),
        )
        db_session.add(nft)
        db_session.commit()

        # Access NFT through booth
        assert len(booth.listings) == 1
        assert booth.listings[0].name == "Test NFT"

        # Access NFT through user
        assert len(user.nfts) == 1
        assert user.nfts[0].name == "Test NFT"


class TestCascadeDeletes:
    """Tests for cascade delete behavior."""

    def test_delete_user_cascades(self, db_session):
        """Test that deleting a user cascades to related records."""
        user = User(
            id="test-user-1",
            username="testuser",
            email="test@example.com",
            hashed_password=hash_password("password123"),
        )
        db_session.add(user)

        subscription = Subscription(
            id="test-sub-1",
            user_id=user.id,
        )
        db_session.add(subscription)

        booth = MarketBooth(
            id="test-booth-1",
            user_id=user.id,
        )
        db_session.add(booth)

        trade = Trade(
            id="test-trade-1",
            user_id=user.id,
            pair="BTC-USD",
            buy_exchange="Binance",
            sell_exchange="Coinbase",
            buy_price=50000.0,
            sell_price=50500.0,
            profit_amount=500.0,
            profit_percentage=1.0,
        )
        db_session.add(trade)

        nft = NFTItem(
            id="test-nft-1",
            name="Test NFT",
            price=100.0,
            creator_id=user.id,
            creator=user.username,
            owner_id=user.id,
            booth_id=booth.id,
            created_at=int(datetime.now().timestamp() * 1000),
        )
        db_session.add(nft)
        db_session.commit()

        # Delete user
        db_session.delete(user)
        db_session.commit()

        # Verify cascaded deletes
        assert (
            db_session.query(Subscription)
            .filter(Subscription.id == "test-sub-1")
            .first()
            is None
        )
        assert (
            db_session.query(MarketBooth)
            .filter(MarketBooth.id == "test-booth-1")
            .first()
            is None
        )
        assert (
            db_session.query(Trade).filter(Trade.id == "test-trade-1").first() is None
        )
        assert (
            db_session.query(NFTItem).filter(NFTItem.id == "test-nft-1").first() is None
        )
