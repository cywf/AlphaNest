export type Exchange = 'Binance' | 'Coinbase' | 'KuCoin' | 'Kraken' | 'Bybit'

export type Cryptocurrency = {
  symbol: string
  name: string
  icon: string
}

export type ExchangePrice = {
  exchange: Exchange
  price: number
}

export type ArbitrageOpportunity = {
  coin: Cryptocurrency
  buyExchange: Exchange
  sellExchange: Exchange
  buyPrice: number
  sellPrice: number
  profitPercentage: number
  timestamp: number
}

export const EXCHANGES: Exchange[] = ['Binance', 'Coinbase', 'KuCoin', 'Kraken', 'Bybit']

export const CRYPTOCURRENCIES: Cryptocurrency[] = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', icon: '◎' },
  { symbol: 'BNB', name: 'Binance Coin', icon: '◆' },
  { symbol: 'ADA', name: 'Cardano', icon: '₳' },
  { symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð' },
  { symbol: 'XRP', name: 'Ripple', icon: '✕' },
  { symbol: 'MATIC', name: 'Polygon', icon: '⬡' },
  { symbol: 'AVAX', name: 'Avalanche', icon: '▲' },
  { symbol: 'DOT', name: 'Polkadot', icon: '●' },
]
