#!/bin/bash
# Database initialization and migration script

set -e

echo "⏳ Waiting for database to be ready..."
python - << 'EOF'
import sys
import time
import os
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql://{os.getenv('DB_USER', 'alphanest')}:"
    f"{os.getenv('DB_PASSWORD', 'alphanest_password')}@"
    f"{os.getenv('DB_HOST', 'db')}:"
    f"{os.getenv('DB_PORT', '5432')}/"
    f"{os.getenv('DB_NAME', 'alphanest')}"
)

max_retries = 30
retry_interval = 2

for i in range(max_retries):
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            print("✅ Database is ready!")
            sys.exit(0)
    except OperationalError as e:
        if i < max_retries - 1:
            print(f"⏳ Waiting for database... ({i+1}/{max_retries})")
            time.sleep(retry_interval)
        else:
            print(f"❌ Failed to connect to database after {max_retries} attempts")
            sys.exit(1)
EOF

echo ""
echo "🔄 Running database migrations..."
cd /app
alembic upgrade head

echo ""
echo "🌱 Seeding demo data..."
python database/seed.py || echo "⚠️  Seed data already exists or failed (non-fatal)"

echo ""
echo "✅ Database initialization complete!"
