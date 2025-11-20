import { API_BASE, DEFAULT_HEADERS } from '@/config/api'
import type { ArbitrageOpportunity, Exchange } from '@/types/arbitrage'
import { CRYPTOCURRENCIES } from '@/types/arbitrage'

// Build helper maps once so repeated requests stay cheap and predictable.
const CRYPTO_BY_SYMBOL = new Map(CRYPTOCURRENCIES.map((coin) => [coin.symbol, coin]))
const EXCHANGE_SET = new Set<Exchange>(['Binance', 'Coinbase', 'KuCoin', 'Kraken', 'Bybit'])

type ApiArbitrageOpportunity = {
  symbol: string
  buy_exchange: string
  sell_exchange: string
  buy_price: number
  sell_price: number
  spread_pct: number
  net_profit_pct?: number
  estimated_profit_usd?: number
  volume_24h?: number
  timestamp: number | string
}

async function fetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...DEFAULT_HEADERS,
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Request failed (${response.status}): ${detail || 'unknown error'}`)
  }

  return response.json() as Promise<T>
}

function normalizeExchange(exchange: string): Exchange {
  const normalized = exchange.trim()
  if (EXCHANGE_SET.has(normalized as Exchange)) {
    return normalized as Exchange
  }
  // Default to Binance so the UI always receives a valid exchange label.
  return 'Binance'
}

function normalizeTimestamp(raw: number | string | undefined): number {
  if (typeof raw === 'number') {
    return raw
  }
  if (typeof raw === 'string') {
    const parsed = Date.parse(raw)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }
  return Date.now()
}

function normalizeCoin(symbolWithPair: string) {
  const base = symbolWithPair.split('/')[0]
  const fallback = {
    symbol: base,
    name: base,
    icon: '◈',
  }
  return CRYPTO_BY_SYMBOL.get(base) ?? fallback
}

function mapApiOpportunity(payload: ApiArbitrageOpportunity): ArbitrageOpportunity {
  const coin = normalizeCoin(payload.symbol)
  return {
    coin,
    buyExchange: normalizeExchange(payload.buy_exchange),
    sellExchange: normalizeExchange(payload.sell_exchange),
    buyPrice: payload.buy_price,
    sellPrice: payload.sell_price,
    profitPercentage: payload.spread_pct,
    timestamp: normalizeTimestamp(payload.timestamp),
  }
}

export async function fetchArbitrageOpportunities(
  enabledExchanges: Exchange[],
): Promise<ArbitrageOpportunity[]> {
  const data = await fetchJson<ApiArbitrageOpportunity[]>('/api/arbitrage/demo')
  const allowed = new Set(enabledExchanges)
  return data
    .map(mapApiOpportunity)
    .filter((opp) => allowed.has(opp.buyExchange) && allowed.has(opp.sellExchange))
}
