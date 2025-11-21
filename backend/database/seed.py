"""Seed database with demo data."""

import sys
import os
from datetime import datetime
import uuid

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database import SessionLocal, User, Subscription, MarketBooth, NFTItem
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


def seed_demo_users(db):
    """Seed demo users."""
    demo_users_data = [
        {
            "username": "CYWF",
            "email": "cywf@demo.alphanest.io",
            "password": "demo123",
            "avatar": "🌟",
            "api_key": "demo_cywf_key_12345",
        },
        {
            "username": "NeonTrader",
            "email": "neontrader@demo.alphanest.io",
            "password": "demo123",
            "avatar": "💎",
            "api_key": "demo_neon_key_67890",
        },
        {
            "username": "CyberNinja",
            "email": "cyberninja@demo.alphanest.io",
            "password": "demo123",
            "avatar": "🥷",
            "api_key": "demo_ninja_key_11111",
        },
    ]
    
    users = []
    for user_data in demo_users_data:
        # Check if user exists
        existing = db.query(User).filter(User.username == user_data["username"]).first()
        if existing:
            print(f"User {user_data['username']} already exists, skipping...")
            users.append(existing)
            continue
        
        user = User(
            id=str(uuid.uuid4()),
            username=user_data["username"],
            email=user_data["email"],
            hashed_password=hash_password(user_data["password"]),
            avatar=user_data["avatar"],
            api_key=user_data["api_key"],
            is_active=True,
        )
        db.add(user)
        users.append(user)
        print(f"Created user: {user.username}")
    
    db.commit()
    return users


def seed_subscriptions(db, users):
    """Seed subscriptions for demo users."""
    for user in users:
        # Check if subscription exists
        existing = db.query(Subscription).filter(Subscription.user_id == user.id).first()
        if existing:
            print(f"Subscription for {user.username} already exists, skipping...")
            continue
        
        subscription = Subscription(
            id=str(uuid.uuid4()),
            user_id=user.id,
            status="active",
            plan_type="monthly",
        )
        db.add(subscription)
        print(f"Created subscription for: {user.username}")
    
    db.commit()


def seed_market_booths(db, users):
    """Seed market booths for demo users."""
    booths = []
    for user in users:
        # Check if booth exists
        existing = db.query(MarketBooth).filter(MarketBooth.user_id == user.id).first()
        if existing:
            print(f"Booth for {user.username} already exists, skipping...")
            booths.append(existing)
            continue
        
        booth = MarketBooth(
            id=str(uuid.uuid4()),
            user_id=user.id,
            bio=f"Welcome to {user.username}'s Market Booth - Trading digital assets in the neon grid",
            theme="cyan" if user.username == "CYWF" else "magenta" if user.username == "NeonTrader" else "gold",
            layout="grid",
            popularity=85 if user.username == "CYWF" else 92,
            reputation=88 if user.username == "CYWF" else 95,
            total_sales=42 if user.username == "CYWF" else 67,
            total_volume=8540.0 if user.username == "CYWF" else 15320.0,
            items_sold=28 if user.username == "CYWF" else 45,
            active_listings=5,
            total_views=1250 if user.username == "CYWF" else 2100,
        )
        db.add(booth)
        booths.append(booth)
        print(f"Created booth for: {user.username}")
    
    db.commit()
    return booths


def seed_nft_items(db, users, booths):
    """Seed NFT items for demo users."""
    # NFT templates for each user
    nft_templates = {
        "CYWF": [
            {
                "name": "Neon Samurai Avatar",
                "description": "Exclusive cyberpunk warrior avatar with animated neon effects",
                "image_url": "⚔️",
                "price": 499,
                "rarity": "legendary",
                "featured": True,
                "metadata": {"collection": "CyberWarriors", "edition": "1/100"},
            },
            {
                "name": "Holo Trading Bot",
                "description": "AI-powered trading assistant with holographic interface",
                "image_url": "🤖",
                "price": 299,
                "rarity": "epic",
                "featured": True,
                "metadata": {"collection": "TradingAI", "edition": "12/500"},
            },
            {
                "name": "Quantum Dashboard",
                "description": "Advanced analytics dashboard with real-time data streams",
                "image_url": "📊",
                "price": 199,
                "rarity": "rare",
                "featured": False,
                "metadata": {"collection": "CyberTools", "edition": "45/1000"},
            },
            {
                "name": "Matrix Scanner Badge",
                "description": "Collectible blockchain scanner badge with neon glow",
                "image_url": "🔍",
                "price": 49,
                "rarity": "common",
                "featured": False,
                "metadata": {"collection": "Badges", "edition": "234/5000"},
            },
            {
                "name": "Glitch Effect Overlay",
                "description": "Animated glitch effect for profile customization",
                "image_url": "✨",
                "price": 89,
                "rarity": "rare",
                "featured": False,
                "metadata": {"collection": "Effects", "edition": "89/2000"},
            },
        ],
        "NeonTrader": [
            {
                "name": "Crypto Crystal Shard",
                "description": "Rare crystallized blockchain data fragment",
                "image_url": "💎",
                "price": 799,
                "rarity": "legendary",
                "featured": True,
                "metadata": {"collection": "CryptoGems", "edition": "3/50"},
            },
            {
                "name": "Neon Dragon Mount",
                "description": "Epic cyberpunk dragon companion NFT",
                "image_url": "🐉",
                "price": 599,
                "rarity": "epic",
                "featured": True,
                "metadata": {"collection": "CyberBeasts", "edition": "27/200"},
            },
            {
                "name": "Holographic Card Pack",
                "description": "Mystery pack containing 5 random NFT cards",
                "image_url": "🎴",
                "price": 149,
                "rarity": "rare",
                "featured": False,
                "metadata": {"collection": "CardPacks", "edition": "unlimited"},
            },
            {
                "name": "Cyberpunk Bike Skin",
                "description": "Custom vehicle skin for your digital rides",
                "image_url": "🏍️",
                "price": 259,
                "rarity": "epic",
                "featured": False,
                "metadata": {"collection": "Vehicles", "edition": "112/500"},
            },
            {
                "name": "Energy Drink Token",
                "description": "Collectible energy boost item for gameplay",
                "image_url": "⚡",
                "price": 29,
                "rarity": "common",
                "featured": False,
                "metadata": {"collection": "Consumables", "edition": "unlimited"},
            },
        ],
        "CyberNinja": [
            {
                "name": "Shadow Blade NFT",
                "description": "Legendary stealth weapon with darkness powers",
                "image_url": "🗡️",
                "price": 699,
                "rarity": "legendary",
                "featured": True,
                "metadata": {"collection": "Weapons", "edition": "7/100"},
            },
            {
                "name": "Ninja Star Collection",
                "description": "Set of 8 unique throwing star designs",
                "image_url": "🌟",
                "price": 349,
                "rarity": "epic",
                "featured": True,
                "metadata": {"collection": "Weapons", "edition": "33/250"},
            },
            {
                "name": "Stealth Cloak",
                "description": "Rare invisibility cloak item",
                "image_url": "👤",
                "price": 449,
                "rarity": "epic",
                "featured": False,
                "metadata": {"collection": "Gear", "edition": "18/300"},
            },
            {
                "name": "Ancient Scroll",
                "description": "Mystical knowledge scroll with secret techniques",
                "image_url": "📜",
                "price": 199,
                "rarity": "rare",
                "featured": False,
                "metadata": {"collection": "Artifacts", "edition": "67/1000"},
            },
            {
                "name": "Training Dummy",
                "description": "Practice dummy for skill development",
                "image_url": "🎯",
                "price": 79,
                "rarity": "common",
                "featured": False,
                "metadata": {"collection": "Training", "edition": "unlimited"},
            },
        ],
    }
    
    for user, booth in zip(users, booths):
        templates = nft_templates.get(user.username, [])
        
        for idx, template in enumerate(templates):
            nft_id = f"nft_{user.id}_{idx}"
            
            # Check if NFT exists
            existing = db.query(NFTItem).filter(NFTItem.id == nft_id).first()
            if existing:
                continue
            
            timestamp = int(datetime.now().timestamp() * 1000)
            
            nft = NFTItem(
                id=nft_id,
                name=template["name"],
                description=template["description"],
                image_url=template["image_url"],
                price=template["price"],
                rarity=template["rarity"],
                creator_id=user.id,
                creator=user.username,
                owner_id=user.id,
                booth_id=booth.id,
                featured=template["featured"],
                views=0,
                favorites=0,
                sales=0,
                nft_attributes=template["metadata"],
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
            print(f"Created NFT: {nft.name} for {user.username}")
    
    db.commit()


def main():
    """Main seed function."""
    print("Starting database seed...")
    
    db = SessionLocal()
    
    try:
        # Seed users
        print("\n=== Seeding Users ===")
        users = seed_demo_users(db)
        
        # Seed subscriptions
        print("\n=== Seeding Subscriptions ===")
        seed_subscriptions(db, users)
        
        # Seed market booths
        print("\n=== Seeding Market Booths ===")
        booths = seed_market_booths(db, users)
        
        # Seed NFT items
        print("\n=== Seeding NFT Items ===")
        seed_nft_items(db, users, booths)
        
        print("\n✅ Database seeding completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
