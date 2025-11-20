# AlphaNest Backend Infrastructure

This directory contains the extended backend infrastructure for AlphaNest, including AI chat features, MCP server, and HashiCorp Vault integration.

## Architecture

### Services

1. **Chat Service** (`backend/chat/`)
   - AI-powered chat with OpenAI ChatKit SDK
   - Function calling and tool execution
   - Conversation management with Supabase
   - Rate limiting

2. **MCP Server** (`backend/mcp/`)
   - Model Context Protocol server for AI agents
   - Exposes backend tools and functions
   - Domain-specific tools:
     - Arbitrage analysis
     - Clan Warz game tools
     - Wallet analysis
     - Naughty coin detection
     - OSINT and coin discovery

3. **Vault Client** (`backend/utils/`)
   - HashiCorp Vault integration
   - Secret rotation (DB credentials, API keys)
   - TOTP generation for service accounts
   - Transit encryption engine

## Chat Service

### Features

- **POST /api/chat/message**: Send messages to AI chat
- **POST /api/chat/tools**: Execute chat tools
- **GET /api/chat/conversation/:id**: Get conversation history
- **GET /api/chat/conversations**: List user conversations

### Available Tools

1. **arbitrage_lookup**: Find arbitrage opportunities
2. **clan_score_lookup**: Get Clan Warz scores
3. **osint_coin_discovery**: Discover new coins
4. **scam_wallet_dossier**: Analyze suspicious wallets
5. **shop_theme_generator**: Generate shop themes
6. **user_onboarding_help**: Onboarding assistance

### Example Usage

```python
import requests

# Send a message
response = requests.post(
    "http://localhost:8000/api/chat/message",
    json={
        "user_id": "user123",
        "message": "Find me arbitrage opportunities for BTC/USDT",
        "tools": ["arbitrage_lookup"]
    }
)
```

## MCP Server

### Features

- **GET /tools**: List all available tools
- **GET /tools/{domain}**: List tools for specific domain
- **POST /execute**: Execute a tool
- **GET /introspect**: Get detailed tool information

### Tool Domains

1. **arbitrage**: Cryptocurrency arbitrage analysis
2. **clan**: Clan Warz game tools
3. **wallet**: Blockchain wallet analysis
4. **naughty_coin**: Scam coin detection
5. **osint**: OSINT and discovery tools

### Example Usage

```python
import requests

# Execute arbitrage tool
response = requests.post(
    "http://localhost:8002/execute",
    json={
        "tool_name": "arbitrage.find_opportunities",
        "parameters": {
            "symbol": "BTC/USDT",
            "min_profit_pct": 0.5
        }
    }
)
```

## HashiCorp Vault

### Configuration

Vault runs in dev mode by default. For production:

1. **KV Secrets Engine**: Key-value secret storage
2. **Database Secrets Engine**: Dynamic database credentials
3. **TOTP Engine**: Time-based one-time passwords
4. **Transit Engine**: Encryption as a service

### Secret Paths

- `secret/data/supabase`: Supabase credentials
- `secret/data/jwt`: JWT secrets
- `secret/data/openai`: OpenAI API keys
- `secret/data/tailscale`: Tailscale auth keys
- `secret/data/zerotier`: Zerotier secrets

### Secret Rotation Schedule

- **Database passwords**: Every 30 days
- **API keys**: Every 7 days
- **VPN keys**: Every deployment

### Example Usage

```python
from backend.utils import vault_client

# Get secret
supabase_creds = vault_client.get_secret("secret/data/supabase")

# Rotate database credentials
new_creds = vault_client.rotate_database_credentials()

# Encrypt data
ciphertext = vault_client.encrypt("sensitive data")

# Decrypt data
plaintext = vault_client.decrypt(ciphertext)
```

## Docker Compose

### Services

```yaml
services:
  vault:           # HashiCorp Vault (port 8200)
  redis:           # Redis cache (port 6379)
  api-gateway:     # FastAPI gateway with chat (port 8000)
  arbitrage-engine: # Arbitrage engine (port 8001)
  mcp-server:      # MCP server (port 8002)
  worker:          # Background worker
  dashboard:       # Astro dashboard (port 3000)
  nginx:           # Reverse proxy (port 80)
```

### Starting Services

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f mcp-server
docker compose logs -f api-gateway

# Stop services
docker compose down
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Vault
VAULT_ADDR=http://vault:8200
VAULT_ROOT_TOKEN=alphanest-dev-token

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key

# OpenAI
OPENAI_API_KEY=sk-your-key

# Database
DB_USER=postgres
DB_PASSWORD=changeme

# Redis
REDIS_URL=redis://redis:6379
```

## Development

### Running Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Run API gateway with chat
uvicorn api_gateway.main:app --reload --port 8000

# Run MCP server
uvicorn backend.mcp.server:app --reload --port 8002

# Run Vault (dev mode)
vault server -dev -dev-root-token-id=alphanest-dev-token
```

### Testing

```bash
# Run all tests
pytest tests/ -v

# Test chat service
pytest tests/backend/chat/ -v

# Test MCP server
pytest tests/backend/mcp/ -v
```

## Security

### Production Considerations

1. **Vault**: Disable dev mode, use proper unsealing
2. **Secrets**: Use Vault for all secrets, never commit to git
3. **API Keys**: Rotate regularly using Vault
4. **Rate Limiting**: Implement Redis-based rate limiting
5. **Authentication**: Use Supabase RLS policies
6. **Network**: Use VPN (Tailscale/Zerotier) for service communication

### Vault Production Setup

```bash
# Initialize Vault
vault operator init

# Unseal Vault (requires 3 of 5 keys)
vault operator unseal <key1>
vault operator unseal <key2>
vault operator unseal <key3>

# Enable engines
vault secrets enable -path=secret kv-v2
vault secrets enable database
vault secrets enable totp
vault secrets enable transit
```

## API Documentation

- **API Gateway**: http://localhost:8000/docs
- **MCP Server**: http://localhost:8002/docs
- **Vault UI**: http://localhost:8200/ui

## Monitoring

### Health Checks

```bash
# API Gateway
curl http://localhost:8000/health

# MCP Server
curl http://localhost:8002/health

# Vault
curl http://localhost:8200/v1/sys/health
```

### Metrics

- Use Prometheus for metrics collection
- Grafana for visualization
- Vault audit logs for security monitoring

## Troubleshooting

### Common Issues

1. **Vault not starting**: Check IPC_LOCK capability
2. **Chat not working**: Verify OPENAI_API_KEY is set
3. **MCP tools failing**: Check arbitrage_engine is running
4. **Secrets not found**: Verify Vault token and paths

### Debug Mode

```bash
# Enable debug logging
DEBUG=true docker compose up
```

## Contributing

When adding new features:

1. Add tool to appropriate MCP domain
2. Update chat_tools.py with function schema
3. Add tests for new functionality
4. Update this README

## License

See main LICENSE file.
