import React, { useState, useEffect } from 'react';

interface ArbitrageOpportunity {
  symbol: string;
  buy_exchange: string;
  sell_exchange: string;
  buy_price: number;
  sell_price: number;
  spread_pct: number;
  net_profit_pct: number;
  estimated_profit_usd: number;
  volume_24h: number;
  timestamp: number;
}

interface ArbitrageTableProps {
  demoMode?: boolean;
  apiKey?: string;
}

export default function ArbitrageTable({ demoMode = true, apiKey }: ArbitrageTableProps) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = demoMode 
        ? '/api/arbitrage/demo'
        : '/api/arbitrage/opportunities';
      
      const headers: HeadersInit = {};
      if (apiKey && !demoMode) {
        headers['X-API-Key'] = apiKey;
      }

      const response = await fetch(endpoint, { headers });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setOpportunities(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities');
      console.error('Error fetching arbitrage data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOpportunities, 10000);
    
    return () => clearInterval(interval);
  }, [demoMode, apiKey]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const getProfitColor = (profit: number) => {
    if (profit >= 0.5) return 'text-success';
    if (profit >= 0.3) return 'text-warning';
    return 'text-info';
  };

  if (loading && opportunities.length === 0) {
    return (
      <div className="flex justify-center items-center p-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold">Error loading arbitrage data</h3>
          <div className="text-xs">{error}</div>
        </div>
        <button className="btn btn-sm" onClick={fetchOpportunities}>Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {demoMode ? '🎮 Demo Mode' : '⚡ Live Arbitrage Opportunities'}
          </h2>
          {lastUpdate && (
            <p className="text-sm opacity-70">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button 
          className="btn btn-circle btn-ghost"
          onClick={fetchOpportunities}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>

      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="alert alert-info shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Demo mode with 5 sample trading pairs. Upgrade to access real-time data from all exchanges.</span>
        </div>
      )}

      {/* Opportunities Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Buy From</th>
              <th>Sell To</th>
              <th className="text-right">Buy Price</th>
              <th className="text-right">Sell Price</th>
              <th className="text-right">Spread</th>
              <th className="text-right">Net Profit</th>
              <th className="text-right">Est. Profit</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 opacity-70">
                  No arbitrage opportunities found at this time.
                </td>
              </tr>
            ) : (
              opportunities.map((opp, index) => (
                <tr key={index} className="hover">
                  <td>
                    <div className="font-bold">{opp.symbol}</div>
                    {opp.volume_24h > 0 && (
                      <div className="text-xs opacity-70">{formatVolume(opp.volume_24h)} vol</div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-primary">{opp.buy_exchange}</span>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{opp.sell_exchange}</span>
                  </td>
                  <td className="text-right font-mono">{formatCurrency(opp.buy_price)}</td>
                  <td className="text-right font-mono">{formatCurrency(opp.sell_price)}</td>
                  <td className="text-right">
                    <span className="badge badge-ghost">{opp.spread_pct.toFixed(2)}%</span>
                  </td>
                  <td className="text-right">
                    <span className={`font-bold ${getProfitColor(opp.net_profit_pct)}`}>
                      {opp.net_profit_pct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={`font-mono ${getProfitColor(opp.net_profit_pct)}`}>
                      {formatCurrency(opp.estimated_profit_usd)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      {opportunities.length > 0 && (
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-title">Opportunities</div>
            <div className="stat-value text-primary">{opportunities.length}</div>
            <div className="stat-desc">Active opportunities</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Best Profit</div>
            <div className="stat-value text-success">
              {Math.max(...opportunities.map(o => o.net_profit_pct)).toFixed(2)}%
            </div>
            <div className="stat-desc">After fees</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Avg. Spread</div>
            <div className="stat-value text-info">
              {(opportunities.reduce((sum, o) => sum + o.spread_pct, 0) / opportunities.length).toFixed(2)}%
            </div>
            <div className="stat-desc">Before fees</div>
          </div>
        </div>
      )}
    </div>
  );
}
