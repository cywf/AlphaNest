import React, { useState } from 'react';

export default function ProfitCalculator() {
  const [investment, setInvestment] = useState(10000);
  const [spreadPct, setSpreadPct] = useState(0.5);
  const [buyFee, setBuyFee] = useState(0.1);
  const [sellFee, setSellFee] = useState(0.1);
  const [withdrawalFee, setWithdrawalFee] = useState(1.0);
  const [transferTime, setTransferTime] = useState(30);

  const calculateProfit = () => {
    // Buy cost
    const buyCost = investment;
    const buyFeeAmount = buyCost * (buyFee / 100);
    const totalBuyCost = buyCost + buyFeeAmount;

    // Sell proceeds
    const sellPrice = buyCost * (1 + spreadPct / 100);
    const sellFeeAmount = sellPrice * (sellFee / 100);
    const sellProceeds = sellPrice - sellFeeAmount;

    // Net profit
    const grossProfit = sellProceeds - buyCost;
    const netProfit = grossProfit - withdrawalFee;
    const netProfitPct = (netProfit / buyCost) * 100;

    // ROI per day (accounting for transfer time)
    const tradesPerDay = (24 * 60) / transferTime;
    const dailyProfit = netProfit * tradesPerDay;
    const dailyRoi = netProfitPct * tradesPerDay;

    return {
      buyCost: totalBuyCost,
      sellProceeds,
      grossProfit,
      netProfit,
      netProfitPct,
      withdrawalFee,
      tradesPerDay,
      dailyProfit,
      dailyRoi,
    };
  };

  const results = calculateProfit();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">
          💰 Profit Calculator
        </h2>
        
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Trade Parameters</h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Investment Amount</span>
                <span className="label-text-alt">{formatCurrency(investment)}</span>
              </label>
              <input
                type="range"
                min="100"
                max="100000"
                step="100"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="range range-primary"
              />
              <div className="flex justify-between text-xs opacity-70 mt-1">
                <span>$100</span>
                <span>$50K</span>
                <span>$100K</span>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Price Spread</span>
                <span className="label-text-alt">{spreadPct.toFixed(2)}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={spreadPct}
                onChange={(e) => setSpreadPct(Number(e.target.value))}
                className="range range-secondary"
              />
              <div className="flex justify-between text-xs opacity-70 mt-1">
                <span>0.1%</span>
                <span>2.5%</span>
                <span>5%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fees & Timing</h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Buy Exchange Fee</span>
                <span className="label-text-alt">{buyFee.toFixed(2)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={buyFee}
                onChange={(e) => setBuyFee(Number(e.target.value))}
                className="range range-accent"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Sell Exchange Fee</span>
                <span className="label-text-alt">{sellFee.toFixed(2)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sellFee}
                onChange={(e) => setSellFee(Number(e.target.value))}
                className="range range-accent"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Withdrawal Fee</span>
                <span className="label-text-alt">{formatCurrency(withdrawalFee)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={withdrawalFee}
                onChange={(e) => setWithdrawalFee(Number(e.target.value))}
                className="range range-accent"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Transfer Time</span>
                <span className="label-text-alt">{transferTime} min</span>
              </label>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={transferTime}
                onChange={(e) => setTransferTime(Number(e.target.value))}
                className="range range-accent"
              />
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* Results Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Profit Analysis</h3>
          
          {/* Single Trade */}
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            <div className="stat">
              <div className="stat-title">Gross Profit</div>
              <div className="stat-value text-success text-2xl">
                {formatCurrency(results.grossProfit)}
              </div>
              <div className="stat-desc">Before withdrawal fee</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Net Profit</div>
              <div className="stat-value text-primary text-2xl">
                {formatCurrency(results.netProfit)}
              </div>
              <div className="stat-desc">{results.netProfitPct.toFixed(2)}% ROI</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Total Fees</div>
              <div className="stat-value text-error text-2xl">
                {formatCurrency(results.buyCost - investment + results.withdrawalFee + (results.sellProceeds - (investment * (1 + spreadPct / 100))))}
              </div>
              <div className="stat-desc">Commissions + withdrawal</div>
            </div>
          </div>

          {/* Daily Projection */}
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="w-full">
              <h4 className="font-bold">Daily Projection</h4>
              <div className="text-sm mt-2 space-y-1">
                <p>Possible trades per day: <span className="font-mono font-bold">{results.tradesPerDay.toFixed(1)}</span></p>
                <p>Daily profit potential: <span className="font-mono font-bold text-success">{formatCurrency(results.dailyProfit)}</span></p>
                <p>Daily ROI: <span className="font-mono font-bold text-primary">{results.dailyRoi.toFixed(2)}%</span></p>
              </div>
            </div>
          </div>

          {/* Workflow Visualization */}
          <div className="mockup-code">
            <pre data-prefix="1"><code>Buy  → {formatCurrency(investment)} @ Exchange A</code></pre>
            <pre data-prefix="2"><code>Fee  → {formatCurrency(investment * (buyFee / 100))} trading fee</code></pre>
            <pre data-prefix="3" className="text-warning"><code>Wait → {transferTime} minutes transfer</code></pre>
            <pre data-prefix="4"><code>Sell → {formatCurrency(investment * (1 + spreadPct / 100))} @ Exchange B</code></pre>
            <pre data-prefix="5"><code>Fee  → {formatCurrency(investment * (1 + spreadPct / 100) * (sellFee / 100))} trading fee</code></pre>
            <pre data-prefix="6"><code>Fee  → {formatCurrency(withdrawalFee)} withdrawal</code></pre>
            <pre data-prefix="7" className="text-success"><code>Profit → {formatCurrency(results.netProfit)} net gain</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}
