# AlphaNest API Documentation

## Base URL
- Development: `http://localhost:8000`
- Production: `https://api.alphanest.io` (when deployed)

## Authentication
Most endpoints support optional API key authentication via the `X-API-Key` header.

```bash
curl -H "X-API-Key: your-api-key" http://localhost:8000/api/arbitrage/opportunities
```

### Demo Mode
When `DEMO_MODE=true`, the API accepts any API key for testing purposes.

## Endpoints

### Health & Status

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "api-gateway"
}
```

#### GET /
Root endpoint with API information.

**Response:**
```json
{
  "name": "AlphaNest Arbitrage API",
  "version": "0.1.0",
  "status": "running"
}
```

### Arbitrage Endpoints

#### GET /api/arbitrage/demo
Get demo arbitrage opportunities (no authentication required).

**Response:**
```json
[
  {
    "symbol": "BTC/USDT",
    "buy_exchange": "Binance",
    "sell_exchange": "Coinbase",
    "buy_price": 43250.00,
    "sell_price": 43450.00,
    "spread_pct": 0.46,
    "net_profit_pct": 0.25,
    "estimated_profit_usd": 108.12,
    "volume_24h": 125000000.0,
    "timestamp": 1763745349484
  }
]
```

#### GET /api/arbitrage/opportunities
Get real-time arbitrage opportunities (requires authentication).

**Headers:**
- `X-API-Key`: Valid API key

**Response:** Same format as `/api/arbitrage/demo`

**Error Responses:**
- `401`: Missing API key
- `403`: Invalid API key
- `402`: Active membership required

#### GET /api/arbitrage/statistics
Get arbitrage engine statistics (public endpoint).

**Response:**
```json
{
  "exchanges_monitored": 5,
  "symbols_watched": 5,
  "min_spread_threshold": 0.5,
  "demo_mode": true
}
```

### Membership Endpoints

#### GET /api/membership/
Get membership plans and pricing information.

**Response:**
```json
{
  "plans": [
    {
      "id": "monthly",
      "name": "Monthly Membership",
      "price": 20.00,
      "currency": "USD",
      "interval": "month",
      "features": [
        "Real-time arbitrage data from 5+ exchanges",
        "Unlimited API requests",
        "Advanced profit calculator",
        "Priority support",
        "Custom alerts"
      ]
    }
  ],
  "demo": {
    "available": true,
    "description": "Try with limited demo data (5 symbols)"
  }
}
```

#### POST /api/membership/subscribe
Create Stripe checkout session for subscription.

**Request Body:**
```json
{
  "email": "user@example.com",
  "plan": "monthly"
}
```

**Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/pay/cs_test_...",
  "session_id": "cs_test_...",
  "message": "Checkout session created (demo mode)",
  "plan": "monthly",
  "email": "user@example.com"
}
```

**Error Responses:**
- `400`: Invalid plan

#### GET /api/membership/status
Check membership status for an API key.

**Query Parameters:**
- `api_key`: The API key to check

**Response:**
```json
{
  "api_key": "demo-key...",
  "active": false,
  "plan": null,
  "expires_at": null
}
```

### Wallet Integration Endpoints

#### POST /api/wallet/sign-transaction
Sign a blockchain transaction (placeholder implementation).

**Request Body:**
```json
{
  "from_address": "0xabc123...",
  "to_address": "0xdef456...",
  "value": "1.5",
  "data": "0x...",
  "gas": "21000",
  "gas_price": "50"
}
```

**Response:**
```json
{
  "status": "signed",
  "txId": "0x19aa76a736aa8ee4e",
  "message": "Transaction signed successfully (demo mode)",
  "from": "0xabc123...",
  "to": "0xdef456...",
  "value": "1.5"
}
```

#### POST /api/wallet/sign-message
Sign a message for verification.

**Request Body:**
```json
{
  "address": "0xabc123...",
  "message": "Sign this message to verify ownership"
}
```

**Response:**
```json
{
  "status": "signed",
  "signature": "0x1234567890abcdef...",
  "message": "Message signed successfully (demo mode)",
  "address": "0xabc123..."
}
```

#### GET /api/wallet/nfts/{address}
Get NFTs owned by a wallet address.

**Response:**
```json
[
  {
    "id": "nft-1",
    "contract_address": "0x1234567890abcdef...",
    "token_id": "1",
    "name": "CyberPunk Trader #1",
    "description": "Rare genesis trader NFT",
    "image": "https://...",
    "collection": "Alpha Traders",
    "chain": "ethereum"
  }
]
```

#### POST /api/wallet/send-nft
Transfer an NFT to another address.

**Request Body:**
```json
{
  "from_address": "0xabc123...",
  "to_address": "0xdef456...",
  "contract_address": "0x1234567890abcdef...",
  "token_id": "1"
}
```

**Response:**
```json
{
  "status": "success",
  "txId": "0x19aa76a736aa8ee4e",
  "message": "NFT transfer initiated (demo mode)",
  "contract": "0x1234567890abcdef...",
  "tokenId": "1",
  "from": "0xabc123...",
  "to": "0xdef456..."
}
```

#### POST /api/wallet/trade-arbscan
Execute arbitrage trade via ArbScan.

**Request Body:**
```json
{
  "token_address": "0xabc123...",
  "amount": "100.0",
  "from_exchange": "Binance",
  "to_exchange": "Coinbase",
  "wallet_address": "0xdef456..."
}
```

**Response:**
```json
{
  "status": "executed",
  "txId": "0x19aa76a736aa8ee4e",
  "message": "Arbitrage trade executed (demo mode)",
  "tokenAddress": "0xabc123...",
  "amount": "100.0",
  "fromExchange": "Binance",
  "toExchange": "Coinbase",
  "estimatedProfit": "0.25%"
}
```

#### GET /api/wallet/balance/{address}
Get wallet balance.

**Response:**
```json
{
  "address": "0xabc123...",
  "balances": [
    {
      "symbol": "ETH",
      "balance": "2.5",
      "usd_value": "6250.00"
    }
  ],
  "totalUsdValue": "22737.50"
}
```

### Market Analysis Endpoints

#### GET /api/analysis/feed
Get market analysis feed with multiple alert categories.

**Query Parameters:**
- `count`: Number of items to return (default: 10, max: 50)

**Response:**
```json
[
  {
    "id": "analysis-1763745349479-8866",
    "timestamp": "2025-11-21T17:15:49.479616",
    "category": "arbitrage",
    "title": "20.2% arbitrage opportunity on PEPE",
    "summary": "Price differential identified. Potential profit: 20.2%. Window closing soon.",
    "tags": ["Arbitrage", "Opportunity", "Time Sensitive"],
    "severity": "medium",
    "deep_link": {
      "type": "arbitrage",
      "id": "PEPE",
      "label": "Trade PEPE"
    },
    "metadata": {
      "coinSymbol": "PEPE",
      "volumeChange": 20.73,
      "priceChange": 37.91,
      "profitPercentage": 20.2
    }
  }
]
```

#### GET /api/analysis/feed/latest
Get the latest analysis item.

**Response:** Single analysis item (same format as feed items)

#### GET /api/analysis/categories
Get available analysis categories.

**Response:**
```json
{
  "categories": [
    {
      "id": "market-trend",
      "name": "Market Trend",
      "severity": "medium",
      "tags": ["Trending", "Volume", "Price Action"]
    }
  ]
}
```

## Analysis Categories

1. **market-trend**: Price movements and volume changes
2. **osint-alert**: Open-source intelligence alerts
3. **whale-movement**: Large wallet transfers
4. **nft-surge**: NFT market activity
5. **arbitrage**: Arbitrage opportunities
6. **scam-alert**: Security warnings
7. **clan-activity**: Community/clan activities
8. **liquidity-pool**: Liquidity pool analytics
9. **sim-trading**: Virtual trading simulation data

## Error Handling

All endpoints return consistent error responses:

```json
{
  "detail": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request (invalid parameters)
- `401`: Unauthorized (missing API key)
- `402`: Payment required (membership required)
- `403`: Forbidden (invalid API key)
- `404`: Not found
- `500`: Internal server error

## Rate Limiting

Default rate limit: 60 requests per minute per API key.

## CORS

CORS is enabled for all origins in development. In production, configure specific allowed origins.

## WebSocket Support

WebSocket endpoints are planned for real-time updates (coming soon).

## Example Usage

### Python
```python
import requests

# Get demo arbitrage data
response = requests.get("http://localhost:8000/api/arbitrage/demo")
opportunities = response.json()

# Get market analysis feed
response = requests.get("http://localhost:8000/api/analysis/feed?count=20")
analysis = response.json()

# Create subscription with API key
headers = {"X-API-Key": "your-api-key"}
response = requests.post(
    "http://localhost:8000/api/membership/subscribe",
    json={"email": "user@example.com", "plan": "monthly"},
    headers=headers
)
checkout = response.json()
```

### JavaScript
```javascript
// Get demo arbitrage data
const response = await fetch('http://localhost:8000/api/arbitrage/demo');
const opportunities = await response.json();

// Get market analysis feed
const analysis = await fetch('http://localhost:8000/api/analysis/feed?count=20');
const feed = await analysis.json();

// Create subscription
const checkout = await fetch('http://localhost:8000/api/membership/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    plan: 'monthly'
  })
});
const session = await checkout.json();
```

### cURL
```bash
# Get demo data
curl http://localhost:8000/api/arbitrage/demo

# Get authenticated data
curl -H "X-API-Key: demo-key-1" http://localhost:8000/api/arbitrage/opportunities

# Create subscription
curl -X POST http://localhost:8000/api/membership/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","plan":"monthly"}'

# Get market analysis
curl http://localhost:8000/api/analysis/feed?count=10
```

## Development Setup

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run the API server:
```bash
uvicorn api_gateway.main:app --reload --host 0.0.0.0 --port 8000
```

4. Access API docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Docker Deployment

```bash
# Build and start all services
docker compose up --build

# Access API through Nginx
curl http://localhost/api/health
```

## Production Considerations

1. **Security**:
   - Set `DEMO_MODE=false` in production
   - Use strong, unique API keys
   - Configure proper CORS origins
   - Enable HTTPS/TLS
   - Implement rate limiting

2. **Environment Variables**:
   - Set `STRIPE_SECRET_KEY` for real payments
   - Configure `VALID_API_KEYS` from database
   - Set `REDIS_URL` for session storage

3. **Monitoring**:
   - Monitor API response times
   - Track error rates
   - Set up logging aggregation
   - Configure health check alerts
