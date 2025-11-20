import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { ArbitrageOpportunity } from '@/types/arbitrage'
import { calculateProfit } from '@/lib/arbitrage'
import { formatCurrency } from '@/lib/format'
import { Calculator, Wallet } from '@phosphor-icons/react'
import { useMetaMask } from '@/modules/walletIntegration/useMetaMask'
import { toast } from 'sonner'

interface ProfitCalculatorProps {
  opportunity: ArbitrageOpportunity | null
}

export function ProfitCalculator({ opportunity }: ProfitCalculatorProps) {
  const [investment, setInvestment] = useState<string>('1000')
  const { isConnected } = useMetaMask()

  const investmentAmount = parseFloat(investment) || 0
  const profit = opportunity ? calculateProfit(investmentAmount, opportunity.profitPercentage) : 0
  const total = investmentAmount + profit
  const fees = investmentAmount * 0.002
  const netProfit = profit - fees

  const handleTradeViaMetaMask = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }
    if (!opportunity) {
      toast.error('Please select an arbitrage opportunity')
      return
    }
    toast.info('Trade via MetaMask (Placeholder)', {
      description: `Trading ${opportunity.coin.symbol} - ${formatCurrency(investmentAmount)} USD`,
    })
  }

  return (
    <Card className="glow-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator size={24} className="text-primary" weight="duotone" />
          Profit Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="investment" className="text-sm text-muted-foreground">
            Investment Amount (USD)
          </Label>
          <Input
            id="investment"
            type="number"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            placeholder="Enter amount"
            className="bg-background/80 border-primary/30 focus:border-primary font-mono text-lg"
            min="0"
            step="100"
          />
          {investmentAmount > 0 && investmentAmount < 10 && (
            <p className="text-xs text-accent">
              Warning: Amount below minimum trading threshold ($10)
            </p>
          )}
        </div>

        {opportunity && investmentAmount > 0 && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Selected Pair:</span>
              <span className="font-semibold text-sm">
                {opportunity.coin.symbol} {opportunity.coin.icon}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Profit %:</span>
              <span className="font-mono text-accent font-semibold">
                {opportunity.profitPercentage.toFixed(2)}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Gross Profit:</span>
              <span className="font-mono text-primary font-semibold">
                ${formatCurrency(profit)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Est. Fees (0.2%):</span>
              <span className="font-mono text-destructive text-sm">
                -${formatCurrency(fees)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <span className="font-semibold">Net Profit:</span>
              <span className="font-mono text-accent font-bold text-lg">
                ${formatCurrency(netProfit)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Return:</span>
              <span className="font-mono text-foreground font-semibold">
                ${formatCurrency(total)}
              </span>
            </div>

            <Button
              className="w-full mt-4 gap-2"
              onClick={handleTradeViaMetaMask}
              disabled={!isConnected || investmentAmount < 10}
            >
              <Wallet size={18} />
              Trade via MetaMask
            </Button>
            {!isConnected && (
              <p className="text-xs text-center text-muted-foreground">
                Connect your wallet to execute trades
              </p>
            )}
          </div>
        )}

        {!opportunity && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Select an arbitrage opportunity from the table to calculate potential profit
          </div>
        )}
      </CardContent>
    </Card>
  )
}
