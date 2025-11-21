# Database Migration Guide

This document describes the database setup, migration process, and data management for the AlphaNest platform.

## Overview

AlphaNest uses PostgreSQL as its primary database with SQLAlchemy ORM for object-relational mapping and Alembic for database migrations.

## Database Schema

### Tables

#### users
Stores user account information.

| Column | Type | Description |
|--------|------|-------------|
| id | String(36) | UUID primary key |
| email | String(255) | Unique email address |
| username | String(100) | Unique username |
| hashed_password | String(255) | Bcrypt hashed password |
| stripe_customer_id | String(255) | Stripe customer ID (nullable) |
| api_key | String(255) | Unique API key for programmatic access |
| avatar | String(10) | User avatar emoji |
| is_active | Boolean | Account active status |
| created_at | DateTime | Account creation timestamp |
| updated_at | DateTime | Last update timestamp |

#### subscriptions
Stores user subscription/membership information.

| Column | Type | Description |
|--------|------|-------------|
| id | String(36) | UUID primary key |
| user_id | String(36) | Foreign key to users table |
| status | String(50) | Subscription status (trial, active, cancelled, expired) |
| plan_type | String(50) | Plan type (monthly, annual) |
| stripe_subscription_id | String(255) | Stripe subscription ID (nullable) |
| next_billing_date | DateTime | Next billing date (nullable) |
| created_at | DateTime | Subscription creation timestamp |
| updated_at | DateTime | Last update timestamp |

#### trades
Stores arbitrage trade history.

| Column | Type | Description |
|--------|------|-------------|
| id | String(36) | UUID primary key |
| user_id | String(36) | Foreign key to users table |
| pair | String(50) | Trading pair (e.g., BTC-USD) |
| buy_exchange | String(100) | Exchange to buy from |
| sell_exchange | String(100) | Exchange to sell on |
| buy_price | Float | Buy price |
| sell_price | Float | Sell price |
| profit_amount | Float | Profit amount |
| profit_percentage | Float | Profit percentage |
| executed | Boolean | Whether trade was executed |
| timestamp | DateTime | Trade timestamp |

#### market_booths
Stores NFT marketplace booth information.

| Column | Type | Description |
|--------|------|-------------|
| id | String(36) | UUID primary key |
| user_id | String(36) | Foreign key to users table (unique) |
| bio | Text | Booth bio/description |
| theme | String(50) | Visual theme (cyan, magenta, gold, glitch) |
| layout | String(50) | Layout style (grid, gallery, terminal) |
| popularity | Integer | Popularity score |
| reputation | Integer | Reputation score |
| total_sales | Integer | Total sales count |
| total_volume | Float | Total sales volume |
| items_sold | Integer | Items sold count |
| active_listings | Integer | Active listings count |
| total_views | Integer | Total views count |
| created_at | DateTime | Booth creation timestamp |
| updated_at | DateTime | Last update timestamp |

#### nft_items
Stores NFT items in the marketplace.

| Column | Type | Description |
|--------|------|-------------|
| id | String(50) | NFT ID (primary key) |
| name | String(255) | NFT name |
| description | Text | NFT description |
| image_url | String(10) | Image emoji or URL |
| price | Float | NFT price |
| rarity | String(50) | Rarity level (common, rare, epic, legendary) |
| creator_id | String(36) | Creator user ID |
| creator | String(100) | Creator username |
| owner_id | String(36) | Foreign key to users table |
| booth_id | String(36) | Foreign key to market_booths table |
| featured | Boolean | Whether NFT is featured |
| views | Integer | View count |
| favorites | Integer | Favorites count |
| sales | Integer | Sales count |
| nft_attributes | JSON | NFT attributes and properties |
| transaction_history | JSON | Transaction history array |
| created_at | BigInteger | Creation timestamp (milliseconds) |

## Setup

### Local Development

1. **Start PostgreSQL container:**
   ```bash
   docker compose up -d db
   ```

2. **Set environment variables:**
   ```bash
   export DATABASE_URL="postgresql://alphanest:alphanest_password@localhost:5432/alphanest"
   ```

3. **Run migrations:**
   ```bash
   cd backend
   alembic upgrade head
   ```

4. **Seed demo data (optional):**
   ```bash
   python database/seed.py
   ```

### Docker Compose

The database is automatically initialized when running the full stack:

```bash
docker compose up -d
```

The API gateway container runs the initialization script (`scripts/init_db.sh`) on startup, which:
1. Waits for the database to be ready
2. Runs Alembic migrations
3. Seeds demo data

## Migrations

### Creating a New Migration

When you modify database models, create a new migration:

```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

**Note:** Since autogenerate requires a running database, you may need to:
1. Start the database: `docker compose up -d db`
2. Run the command above
3. Review the generated migration file in `alembic/versions/`

### Applying Migrations

To apply all pending migrations:

```bash
alembic upgrade head
```

To upgrade to a specific migration:

```bash
alembic upgrade <revision_id>
```

### Rolling Back Migrations

To rollback one migration:

```bash
alembic downgrade -1
```

To rollback to a specific migration:

```bash
alembic downgrade <revision_id>
```

### Checking Migration Status

To see current migration version:

```bash
alembic current
```

To see migration history:

```bash
alembic history
```

## Data Migration

### From localStorage to Database

The frontend previously stored NFT marketplace data in browser localStorage. This data now persists in the database via API endpoints.

#### Migration Steps:

1. **Users should register accounts** using the `/api/auth/register` endpoint
2. **Market booths are created automatically** during registration
3. **NFTs can be created** via the `/api/market/nft` endpoint

The seeding script (`database/seed.py`) creates demo data that mirrors the original localStorage demo:
- 3 demo users: CYWF, NeonTrader, CyberNinja
- Market booths for each user
- 5 NFT items per user

### Demo Data

To reset demo data:

```bash
# Backup existing data if needed
pg_dump -h localhost -U alphanest alphanest > backup.sql

# Drop and recreate database
docker compose down -v
docker compose up -d db

# Reinitialize
cd backend
alembic upgrade head
python database/seed.py
```

## Database Connections

### Connection String Format

```
postgresql://<user>:<password>@<host>:<port>/<database>
```

### Environment Variables

Set these in your `.env` file:

```bash
DATABASE_URL=postgresql://alphanest:alphanest_password@db:5432/alphanest
DB_USER=alphanest
DB_PASSWORD=alphanest_password
DB_HOST=db
DB_PORT=5432
DB_NAME=alphanest
```

### Direct Database Access

#### Using psql

```bash
# Connect to database
docker compose exec db psql -U alphanest -d alphanest

# List tables
\dt

# Describe table
\d users

# Query data
SELECT username, email FROM users;
```

#### Using a GUI Tool

Connection details:
- **Host:** localhost
- **Port:** 5432
- **Database:** alphanest
- **User:** alphanest
- **Password:** alphanest_password

Recommended tools:
- pgAdmin
- DBeaver
- TablePlus

## Backup and Restore

### Backup

```bash
# Backup to file
docker compose exec db pg_dump -U alphanest alphanest > backup.sql

# Backup with compression
docker compose exec db pg_dump -U alphanest alphanest | gzip > backup.sql.gz
```

### Restore

```bash
# Restore from file
docker compose exec -T db psql -U alphanest alphanest < backup.sql

# Restore from compressed file
gunzip -c backup.sql.gz | docker compose exec -T db psql -U alphanest alphanest
```

## Troubleshooting

### Database Connection Issues

1. **Check if database is running:**
   ```bash
   docker compose ps db
   ```

2. **Check database logs:**
   ```bash
   docker compose logs db
   ```

3. **Verify connection:**
   ```bash
   docker compose exec db psql -U alphanest -d alphanest -c "SELECT 1"
   ```

### Migration Issues

1. **Check current migration version:**
   ```bash
   alembic current
   ```

2. **Check for pending migrations:**
   ```bash
   alembic history
   ```

3. **Force migration to specific version:**
   ```bash
   alembic stamp <revision_id>
   ```

### Data Integrity Issues

1. **Check for orphaned records:**
   ```sql
   -- Users without subscriptions
   SELECT u.id, u.username FROM users u
   LEFT JOIN subscriptions s ON u.id = s.user_id
   WHERE s.id IS NULL;
   
   -- NFTs without valid booth
   SELECT n.id, n.name FROM nft_items n
   LEFT JOIN market_booths b ON n.booth_id = b.id
   WHERE b.id IS NULL;
   ```

2. **Verify foreign key constraints:**
   ```sql
   SELECT 
     tc.constraint_name, 
     tc.table_name, 
     kcu.column_name,
     ccu.table_name AS foreign_table_name,
     ccu.column_name AS foreign_column_name 
   FROM information_schema.table_constraints AS tc
   JOIN information_schema.key_column_usage AS kcu
     ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.constraint_column_usage AS ccu
     ON ccu.constraint_name = tc.constraint_name
   WHERE constraint_type = 'FOREIGN KEY';
   ```

## Security Considerations

### Password Hashing

- Passwords are hashed using bcrypt with automatic salt generation
- Never store plain text passwords
- Password strength requirements: minimum 6 characters

### API Keys

- API keys are generated using secure random tokens
- Format: `ak_<32_random_characters>`
- Store API keys securely and never commit to version control

### Database Credentials

- Use strong passwords in production
- Never commit `.env` files with real credentials
- Use environment variables or secrets management systems
- Rotate credentials regularly

### SQL Injection Prevention

- SQLAlchemy ORM provides automatic parameterization
- Never use string concatenation for SQL queries
- Always use ORM methods or prepared statements

## Performance Optimization

### Indexes

The following indexes are automatically created:
- `ix_users_email` on `users.email`
- `ix_users_username` on `users.username`
- `ix_users_api_key` on `users.api_key`

### Connection Pooling

SQLAlchemy manages a connection pool automatically with these settings:
- `pool_pre_ping=True` - Verify connections before using
- Default pool size: 5
- Max overflow: 10

### Query Optimization

Tips for efficient queries:
1. Use pagination for large result sets
2. Eager load relationships when needed
3. Add indexes for frequently queried columns
4. Use database-level aggregations

## Future Enhancements

Potential improvements to the database layer:
1. **Full-text search** using PostgreSQL's built-in capabilities
2. **Caching layer** with Redis for frequently accessed data
3. **Read replicas** for scalability
4. **Partitioning** for large tables (trades, transaction history)
5. **Time-series data** optimization for trade history
6. **Analytics views** for reporting and dashboards
