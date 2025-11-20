import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ArbitrageOpportunity } from '@/types/arbitrage'
import { getProfitTier } from '@/lib/arbitrage'
import { formatCurrency, formatPercentage } from '@/lib/format'
import { ExchangeBadge } from './ExchangeBadge'
import { ArrowsLeftRight, CaretUp, CaretDown, Lightning } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArbitrageTableSkeleton } from './common/ArbitrageTableSkeleton'
import { useIsMobile } from '@/hooks/use-mobile'

interface ArbitrageTableProps {
  opportunities: ArbitrageOpportunity[]
  onSelectOpportunity: (opportunity: ArbitrageOpportunity) => void
  selectedOpportunity: ArbitrageOpportunity | null
  isLoading?: boolean
}

type SortColumn = 'coin' | 'profit' | 'buyPrice' | 'sellPrice'
type SortDirection = 'asc' | 'desc'

export function ArbitrageTable({
  opportunities,
  onSelectOpportunity,
  selectedOpportunity,
  isLoading = false,
}: ArbitrageTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('profit')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const isMobile = useIsMobile()

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    let comparison = 0

    switch (sortColumn) {
      case 'coin':
        comparison = a.coin.symbol.localeCompare(b.coin.symbol)
        break
      case 'profit':
        comparison = a.profitPercentage - b.profitPercentage
        break
      case 'buyPrice':
        comparison = a.buyPrice - b.buyPrice
        break
      case 'sellPrice':
        comparison = a.sellPrice - b.sellPrice
        break
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return null
    return sortDirection === 'asc' ? (
      <CaretUp size={16} weight="bold" className="inline" />
    ) : (
      <CaretDown size={16} weight="bold" className="inline" />
    )
  }

  if (isLoading) {
    return <ArbitrageTableSkeleton />
  }

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <div className="text-4xl mb-4 opacity-50">⚠</div>
        <p className="text-lg">No arbitrage opportunities found</p>
        <p className="text-sm mt-2">Try enabling more exchanges or check back soon</p>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="space-y-3 px-2">
        {sortedOpportunities.map((opportunity, index) => {
          const tier = getProfitTier(opportunity.profitPercentage)
          const isSelected = selectedOpportunity?.timestamp === opportunity.timestamp
          const isHighProfit = tier === 'high'

          return (
            <motion.div
              key={`${opportunity.coin.symbol}-${opportunity.timestamp}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  'transition-all duration-300 cursor-pointer',
                  isSelected && 'glow-border bg-primary/10',
                  isHighProfit && 'glow-border-accent',
                  !isSelected && 'bg-card/50 backdrop-blur-sm'
                )}
                style={
                  isHighProfit
                    ? { animation: 'glow-pulse-accent 2s ease-in-out infinite' }
                    : undefined
                }
                onClick={() => onSelectOpportunity(opportunity)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{opportunity.coin.icon}</span>
                      <div>
                        <div className="font-semibold text-lg">{opportunity.coin.symbol}</div>
                        <div className="text-xs text-muted-foreground">
                          {opportunity.coin.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {isHighProfit && (
                          <Lightning size={16} weight="fill" className="text-accent" />
                        )}
                        <span
                          className={cn(
                            'font-mono font-bold text-lg',
                            tier === 'high' && 'text-accent',
                            tier === 'medium' && 'text-secondary',
                            tier === 'low' && 'text-primary'
                          )}
                        >
                          +{formatPercentage(opportunity.profitPercentage)}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Profit</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Buy From</div>
                      <ExchangeBadge exchange={opportunity.buyExchange} />
                      <div className="font-mono text-sm text-green-400">
                        ${formatCurrency(opportunity.buyPrice)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Sell To</div>
                      <ExchangeBadge exchange={opportunity.sellExchange} />
                      <div className="font-mono text-sm text-secondary">
                        ${formatCurrency(opportunity.sellPrice)}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isSelected ? 'default' : 'outline'}
                    className={cn(
                      'w-full gap-1.5 font-medium transition-all duration-300',
                      !isSelected && 'border-primary/50 hover:border-primary hover:bg-primary/20'
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectOpportunity(opportunity)
                    }}
                  >
                    <ArrowsLeftRight size={16} weight="bold" />
                    {isSelected ? 'Selected' : 'Calculate'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-primary/30 hover:bg-transparent">
            <TableHead
              className="cursor-pointer select-none hover:text-primary transition-colors"
              onClick={() => handleSort('coin')}
            >
              <div className="flex items-center gap-1">
                Cryptocurrency <SortIcon column="coin" />
              </div>
            </TableHead>
            <TableHead>Buy From</TableHead>
            <TableHead>Sell To</TableHead>
            <TableHead
              className="cursor-pointer select-none hover:text-primary transition-colors text-right"
              onClick={() => handleSort('buyPrice')}
            >
              <div className="flex items-center justify-end gap-1">
                Buy Price <SortIcon column="buyPrice" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none hover:text-primary transition-colors text-right"
              onClick={() => handleSort('sellPrice')}
            >
              <div className="flex items-center justify-end gap-1">
                Sell Price <SortIcon column="sellPrice" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none hover:text-primary transition-colors text-right"
              onClick={() => handleSort('profit')}
            >
              <div className="flex items-center justify-end gap-1">
                Profit % <SortIcon column="profit" />
              </div>
            </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOpportunities.map((opportunity, index) => {
            const tier = getProfitTier(opportunity.profitPercentage)
            const isSelected = selectedOpportunity?.timestamp === opportunity.timestamp
            const isHighProfit = tier === 'high'

            return (
              <motion.tr
                key={`${opportunity.coin.symbol}-${opportunity.timestamp}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'border-b border-border/30 transition-all duration-300 cursor-pointer',
                  'hover:bg-primary/5',
                  isSelected && 'bg-primary/10 glow-border',
                  isHighProfit && 'glow-border-accent'
                )}
                style={
                  isHighProfit
                    ? {
                        animation: 'glow-pulse-accent 2s ease-in-out infinite',
                      }
                    : undefined
                }
                onClick={() => onSelectOpportunity(opportunity)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{opportunity.coin.icon}</span>
                    <div>
                      <div className="font-semibold">{opportunity.coin.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {opportunity.coin.name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <ExchangeBadge exchange={opportunity.buyExchange} />
                </TableCell>
                <TableCell>
                  <ExchangeBadge exchange={opportunity.sellExchange} />
                </TableCell>
                <TableCell className="text-right font-mono text-green-400">
                  ${formatCurrency(opportunity.buyPrice)}
                </TableCell>
                <TableCell className="text-right font-mono text-secondary">
                  ${formatCurrency(opportunity.sellPrice)}
                </TableCell>
                <TableCell className="text-right font-mono font-bold">
                  <div className="flex items-center justify-end gap-1">
                    {isHighProfit && (
                      <Lightning size={16} weight="fill" className="text-accent" />
                    )}
                    <span
                      className={cn(
                        tier === 'high' && 'text-accent',
                        tier === 'medium' && 'text-secondary',
                        tier === 'low' && 'text-primary'
                      )}
                    >
                      +{formatPercentage(opportunity.profitPercentage)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => onSelectOpportunity(opportunity)}
                    className={cn(
                      'gap-1.5 font-medium transition-all duration-300',
                      !isSelected &&
                        'border-primary/50 hover:border-primary hover:bg-primary/20'
                    )}
                  >
                    <ArrowsLeftRight size={16} weight="bold" />
                    Calculate
                  </Button>
                </TableCell>
              </motion.tr>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
