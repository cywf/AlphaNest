"""Initial database schema

Revision ID: d9a4a7469274
Revises: 
Create Date: 2025-11-21 17:15:09.109797

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd9a4a7469274'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('username', sa.String(100), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('stripe_customer_id', sa.String(255), unique=True, nullable=True),
        sa.Column('api_key', sa.String(255), unique=True, nullable=True),
        sa.Column('avatar', sa.String(10), default='👤'),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_username', 'users', ['username'])
    op.create_index('ix_users_api_key', 'users', ['api_key'])
    
    # Create subscriptions table
    op.create_table(
        'subscriptions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.String(50), default='trial'),
        sa.Column('plan_type', sa.String(50), default='monthly'),
        sa.Column('stripe_subscription_id', sa.String(255), unique=True, nullable=True),
        sa.Column('next_billing_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    
    # Create trades table
    op.create_table(
        'trades',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('pair', sa.String(50), nullable=False),
        sa.Column('buy_exchange', sa.String(100), nullable=False),
        sa.Column('sell_exchange', sa.String(100), nullable=False),
        sa.Column('buy_price', sa.Float, nullable=False),
        sa.Column('sell_price', sa.Float, nullable=False),
        sa.Column('profit_amount', sa.Float, nullable=False),
        sa.Column('profit_percentage', sa.Float, nullable=False),
        sa.Column('executed', sa.Boolean, default=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Create market_booths table
    op.create_table(
        'market_booths',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False),
        sa.Column('bio', sa.Text, default=''),
        sa.Column('theme', sa.String(50), default='cyan'),
        sa.Column('layout', sa.String(50), default='grid'),
        sa.Column('popularity', sa.Integer, default=0),
        sa.Column('reputation', sa.Integer, default=0),
        sa.Column('total_sales', sa.Integer, default=0),
        sa.Column('total_volume', sa.Float, default=0.0),
        sa.Column('items_sold', sa.Integer, default=0),
        sa.Column('active_listings', sa.Integer, default=0),
        sa.Column('total_views', sa.Integer, default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    
    # Create nft_items table
    op.create_table(
        'nft_items',
        sa.Column('id', sa.String(50), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, default=''),
        sa.Column('image_url', sa.String(10), default='🎨'),
        sa.Column('price', sa.Float, nullable=False),
        sa.Column('rarity', sa.String(50), default='common'),
        sa.Column('creator_id', sa.String(36), nullable=False),
        sa.Column('creator', sa.String(100), nullable=False),
        sa.Column('owner_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('booth_id', sa.String(36), sa.ForeignKey('market_booths.id', ondelete='CASCADE'), nullable=False),
        sa.Column('featured', sa.Boolean, default=False),
        sa.Column('views', sa.Integer, default=0),
        sa.Column('favorites', sa.Integer, default=0),
        sa.Column('sales', sa.Integer, default=0),
        sa.Column('nft_metadata', sa.JSON, default={}),
        sa.Column('transaction_history', sa.JSON, default=[]),
        sa.Column('created_at', sa.BigInteger, nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('nft_items')
    op.drop_table('market_booths')
    op.drop_table('trades')
    op.drop_table('subscriptions')
    op.drop_index('ix_users_api_key', 'users')
    op.drop_index('ix_users_username', 'users')
    op.drop_index('ix_users_email', 'users')
    op.drop_table('users')
