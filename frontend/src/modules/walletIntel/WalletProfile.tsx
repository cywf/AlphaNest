import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { WalletBadge } from './WalletBadge'
import { ScamScoreMeter } from '../naughtyCoins/ScamScoreMeter'
import { truncateAddress, formatCompactNumber, formatCurrency } from '@/lib/format'
import { 
  Warning, 
  Skull, 
  Users, 
  Graph, 
  ChartLine,
  CurrencyDollar,
  Clock,
  Fingerprint,
  ShieldWarning,
  ArrowsLeftRight
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ScamWallet } from './walletIntelTypes'

interface WalletProfileProps {
  wallet: ScamWallet
}

export function WalletProfile({ wallet }: WalletProfileProps) {
  const showExpandedDossier = wallet.scamScore >= 60
  const showCriticalMode = wallet.scamScore > 90

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getBehaviorColor = (score: number): string => {
    if (score >= 80) return 'text-red-500'
    if (score >= 60) return 'text-orange-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getBehaviorLabel = (score: number): string => {
    if (score >= 80) return 'Critical'
    if (score >= 60) return 'High'
    if (score >= 40) return 'Moderate'
    return 'Low'
  }

  const getBehaviorDescription = (metric: string, score: number): string => {
    switch (metric) {
      case 'burstActivity':
        return score >= 70 
          ? 'Rapid trading patterns detected indicating coordinated pump/dump behavior'
          : 'Transaction frequency within normal parameters'
      case 'laundering':
        return score >= 70
          ? 'Complex mixing and layering patterns suggest money laundering activity'
          : 'Standard transaction flow with minimal obfuscation'
      case 'timing':
        return score >= 70
          ? 'Highly correlated timing with known scam events and cluster members'
          : 'Transaction timing appears independent'
      case 'mixer':
        return score >= 70
          ? 'Frequent interaction with known mixing services and privacy protocols'
          : 'Limited or no mixer usage detected'
      default:
        return ''
    }
  }

  const riskFrameClass = showCriticalMode 
    ? 'border-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-pulse' 
    : showExpandedDossier 
    ? 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)]' 
    : 'border-border'

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={cn(
          'glow-border bg-card/50 backdrop-blur-sm p-8 border-2',
          riskFrameClass
        )}>
          {showCriticalMode && (
            <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Skull size={28} weight="fill" className="text-red-500" />
                <div>
                  <h3 className="text-lg font-bold text-red-400 uppercase tracking-wide">
                    Critical Threat Mode Active
                  </h3>
                  <p className="text-sm text-red-300/80">
                    Extended analysis unlocked • Enhanced OSINT traces enabled
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Fingerprint size={32} className="text-primary" />
                  <h1 className="text-3xl font-bold font-mono">{wallet.label}</h1>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-mono text-sm">
                    {truncateAddress(wallet.address, 12, 8)}
                  </span>
                </div>
              </div>
              
              <WalletBadge 
                riskLevel={wallet.riskLevel} 
                score={wallet.scamScore}
                size="lg"
                showGlitch={true}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Warning size={20} className="text-red-500" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Rug Pulls</span>
                </div>
                <div className="text-2xl font-bold font-mono text-red-400">
                  {wallet.numberOfRugPulls}
                </div>
              </div>

              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Graph size={20} className="text-orange-500" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Connections</span>
                </div>
                <div className="text-2xl font-bold font-mono text-orange-400">
                  {wallet.flaggedConnections}
                </div>
              </div>

              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <CurrencyDollar size={20} className="text-primary" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Value</span>
                </div>
                <div className="text-2xl font-bold font-mono text-primary">
                  ${formatCompactNumber(wallet.totalValue)}
                </div>
              </div>

              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowsLeftRight size={20} className="text-accent" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Transactions</span>
                </div>
                <div className="text-2xl font-bold font-mono text-accent">
                  {formatCompactNumber(wallet.transactionCount)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Risk Assessment
              </h3>
              <ScamScoreMeter 
                score={wallet.scamScore} 
                riskLevel={wallet.riskLevel}
                size="lg"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {wallet.riskTags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="border-red-500/50 text-red-400 font-mono"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {wallet.cluster && (
              <Card className="bg-background/30 border-accent/30 p-4">
                <div className="flex items-center gap-3">
                  <Users size={24} className="text-accent" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-accent">{wallet.cluster.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {wallet.cluster.memberCount} members • Coordination Score: {wallet.cluster.coordinationScore}/100
                    </p>
                  </div>
                  <Badge variant="outline" className="border-accent/50 text-accent font-mono">
                    Cluster ID: {wallet.cluster.id}
                  </Badge>
                </div>
              </Card>
            )}
          </div>
        </Card>
      </motion.div>

      {wallet.scamScore >= 20 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ChartLine size={24} className="text-primary" />
              Behavior Analytics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Burst Activity</span>
                  <span className={cn('text-sm font-mono font-bold', getBehaviorColor(wallet.behaviorMetrics.burstActivityScore))}>
                    {getBehaviorLabel(wallet.behaviorMetrics.burstActivityScore)}
                  </span>
                </div>
                <ScamScoreMeter 
                  score={wallet.behaviorMetrics.burstActivityScore} 
                  riskLevel={wallet.riskLevel}
                  size="sm"
                  showLabel={false}
                />
                <p className="text-xs text-muted-foreground">
                  {getBehaviorDescription('burstActivity', wallet.behaviorMetrics.burstActivityScore)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Laundering Likelihood</span>
                  <span className={cn('text-sm font-mono font-bold', getBehaviorColor(wallet.behaviorMetrics.launderingLikelihoodScore))}>
                    {getBehaviorLabel(wallet.behaviorMetrics.launderingLikelihoodScore)}
                  </span>
                </div>
                <ScamScoreMeter 
                  score={wallet.behaviorMetrics.launderingLikelihoodScore} 
                  riskLevel={wallet.riskLevel}
                  size="sm"
                  showLabel={false}
                />
                <p className="text-xs text-muted-foreground">
                  {getBehaviorDescription('laundering', wallet.behaviorMetrics.launderingLikelihoodScore)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Timing Correlation</span>
                  <span className={cn('text-sm font-mono font-bold', getBehaviorColor(wallet.behaviorMetrics.timingCorrelationScore))}>
                    {getBehaviorLabel(wallet.behaviorMetrics.timingCorrelationScore)}
                  </span>
                </div>
                <ScamScoreMeter 
                  score={wallet.behaviorMetrics.timingCorrelationScore} 
                  riskLevel={wallet.riskLevel}
                  size="sm"
                  showLabel={false}
                />
                <p className="text-xs text-muted-foreground">
                  {getBehaviorDescription('timing', wallet.behaviorMetrics.timingCorrelationScore)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Mixer Usage</span>
                  <span className={cn('text-sm font-mono font-bold', getBehaviorColor(wallet.behaviorMetrics.mixerUsageScore))}>
                    {getBehaviorLabel(wallet.behaviorMetrics.mixerUsageScore)}
                  </span>
                </div>
                <ScamScoreMeter 
                  score={wallet.behaviorMetrics.mixerUsageScore} 
                  riskLevel={wallet.riskLevel}
                  size="sm"
                  showLabel={false}
                />
                <p className="text-xs text-muted-foreground">
                  {getBehaviorDescription('mixer', wallet.behaviorMetrics.mixerUsageScore)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {showExpandedDossier && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldWarning size={24} className="text-orange-500" />
                Token Involvement Summary
              </h2>
              
              <div className="space-y-3">
                {wallet.tokenInvolvements.slice(0, showCriticalMode ? 10 : 5).map((token) => (
                  <div 
                    key={token.contractAddress}
                    className="p-4 bg-background/30 rounded-lg border border-border/50 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold font-mono">{token.tokenName}</h4>
                          <Badge variant="outline" className="text-xs">
                            {token.tokenSymbol}
                          </Badge>
                          <Badge 
                            variant={token.role === 'deployer' ? 'destructive' : 'secondary'}
                            className="text-xs uppercase"
                          >
                            {token.role.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mb-2">
                          {truncateAddress(token.contractAddress, 8, 6)}
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-muted-foreground">
                            First Interaction: {formatDate(token.firstInteraction)}
                          </span>
                          {token.victimCount && (
                            <span className="text-red-400">
                              Victims: {formatCompactNumber(token.victimCount)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Scam Score</div>
                        <div className="text-lg font-bold font-mono text-red-400">
                          {token.scamScore}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Graph size={24} className="text-primary" />
                Connected Wallets Map
              </h2>
              
              <div className="space-y-2">
                {wallet.connectedWallets.slice(0, showCriticalMode ? 15 : 8).map((connected) => (
                  <div 
                    key={connected.address}
                    className={cn(
                      'p-3 rounded-lg border transition-all',
                      connected.relationship === 'direct' 
                        ? 'bg-red-500/10 border-red-500/50' 
                        : connected.relationship === 'cluster'
                        ? 'bg-purple-500/10 border-purple-500/50'
                        : 'bg-orange-500/10 border-orange-500/30'
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-mono text-sm mb-1">
                          {truncateAddress(connected.address, 10, 8)}
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'uppercase text-xs',
                              connected.relationship === 'direct' && 'border-red-500/50 text-red-400',
                              connected.relationship === 'cluster' && 'border-purple-500/50 text-purple-400',
                              connected.relationship === 'indirect' && 'border-orange-500/50 text-orange-400'
                            )}
                          >
                            {connected.relationship}
                          </Badge>
                          <span className="text-muted-foreground">
                            {connected.transactionCount} txns
                          </span>
                          <span className="text-muted-foreground">
                            Connection: {connected.connectionStrength.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Scam Score</div>
                        <div className="font-mono font-bold text-sm text-red-400">
                          {connected.scamScore}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: showExpandedDossier ? 0.4 : 0.2 }}
      >
        <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock size={24} className="text-accent" />
            Recent Suspicious Transactions
          </h2>
          
          <div className="space-y-2">
            {wallet.suspiciousTransactions.slice(0, 10).map((tx) => (
              <div 
                key={tx.hash}
                className="p-4 bg-background/30 rounded-lg border border-border/50 hover:bg-background/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="font-mono text-xs text-muted-foreground mb-1">
                      {truncateAddress(tx.hash, 12, 10)}
                    </div>
                    <div className="text-sm mb-2">{tx.flagReason}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(tx.timestamp)}</span>
                      <span>•</span>
                      <span>{formatCurrency(tx.value)} {tx.token}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={tx.severity === 'critical' ? 'destructive' : 'outline'}
                    className="uppercase text-xs"
                  >
                    {tx.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: showExpandedDossier ? 0.5 : 0.3 }}
      >
        <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Fingerprint size={24} className="text-muted-foreground" />
            Timeline & Detection
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
              <span className="text-sm text-muted-foreground">First Detected</span>
              <span className="font-mono font-semibold">{formatDate(wallet.firstDetected)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Last Activity</span>
              <span className="font-mono font-semibold">{formatDate(wallet.lastSeenActivity)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Detection Patterns</span>
              <div className="flex gap-2">
                {wallet.detectionPatterns.map((pattern) => (
                  <Badge key={pattern} variant="outline" className="text-xs uppercase font-mono">
                    {pattern.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
