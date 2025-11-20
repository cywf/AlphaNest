import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useNewCoinDiscovery } from './useNewCoinDiscovery'
import { CoinMetricsVisualizer } from './CoinMetricsVisualizer'
import { generateLinkAnalysis, calculateNetworkMetrics } from './linkAnalysis'
import type { NewCoin, LaunchWindow } from './types'
import {
  Sparkle,
  TrendUp,
  Warning,
  TwitterLogo,
  TelegramLogo,
  DiscordLogo,
  Globe,
  GithubLogo,
  ArrowsClockwise,
  ShareNetwork,
  Fire,
  Cube,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

function getSentimentColor(score: number): string {
  if (score >= 70) return 'bg-green-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getRiskColor(risk: string): string {
  switch (risk) {
    case 'low':
      return 'text-green-400 border-green-400'
    case 'medium':
      return 'text-yellow-400 border-yellow-400'
    case 'high':
      return 'text-orange-400 border-orange-400'
    case 'extreme':
      return 'text-red-400 border-red-400'
    default:
      return 'text-muted-foreground'
  }
}

function getHypeColor(hype: string): string {
  switch (hype) {
    case 'viral':
      return 'text-accent border-accent'
    case 'trending':
      return 'text-secondary border-secondary'
    case 'growing':
      return 'text-primary border-primary'
    default:
      return 'text-muted-foreground border-muted-foreground'
  }
}

function getSocialIcon(type: string): React.ReactNode {
  switch (type) {
    case 'twitter':
      return <TwitterLogo size={14} weight="fill" />
    case 'telegram':
      return <TelegramLogo size={14} weight="fill" />
    case 'discord':
      return <DiscordLogo size={14} weight="fill" />
    case 'website':
      return <Globe size={14} weight="fill" />
    case 'github':
      return <GithubLogo size={14} weight="fill" />
    default:
      return <Globe size={14} />
  }
}

interface CoinCardProps {
  coin: NewCoin
}

function CoinCard({ coin }: CoinCardProps) {
  const [showNetwork, setShowNetwork] = useState(false)
  const [show3DVisualizer, setShow3DVisualizer] = useState(false)
  const linkAnalysis = generateLinkAnalysis(coin)
  const metrics = calculateNetworkMetrics(linkAnalysis)
  
  const isLaunchingSoon = coin.daysUntilLaunch <= 3
  const isHighSentiment = coin.sentimentScore >= 70
  
  return (
    <>
      {show3DVisualizer && (
        <CoinMetricsVisualizer 
          coin={coin} 
          onClose={() => setShow3DVisualizer(false)} 
        />
      )}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          'glow-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300',
          isLaunchingSoon && isHighSentiment && 'glow-border-accent'
        )}
        style={
          isLaunchingSoon && isHighSentiment
            ? { animation: 'glow-pulse-accent 2s ease-in-out infinite' }
            : undefined
        }
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkle
                  size={20}
                  weight="fill"
                  className={cn('text-primary', coin.hypeLevel === 'viral' && 'animate-pulse')}
                />
                {coin.coinName}
                <span className="text-sm font-mono text-muted-foreground">
                  ${coin.symbol}
                </span>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{coin.description}</p>
            </div>
            {coin.hypeLevel === 'viral' && (
              <Fire size={24} weight="fill" className="text-accent animate-pulse" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {coin.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-primary/30">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Launch Date:</span>
              <span
                className={cn(
                  'text-sm font-medium font-mono',
                  isLaunchingSoon ? 'text-accent' : 'text-foreground'
                )}
              >
                {coin.daysUntilLaunch === 0
                  ? 'Live Now'
                  : `${coin.daysUntilLaunch}d`}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sentiment Score:</span>
                <span className="text-sm font-mono font-semibold">
                  {coin.sentimentScore.toFixed(1)}/100
                </span>
              </div>
              <Progress 
                value={coin.sentimentScore} 
                className="h-2"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Risk Level:</span>
              <Badge variant="outline" className={cn('text-xs', getRiskColor(coin.riskLevel))}>
                <Warning size={12} weight="fill" className="mr-1" />
                {coin.riskLevel.toUpperCase()}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Hype Level:</span>
              <Badge variant="outline" className={cn('text-xs', getHypeColor(coin.hypeLevel))}>
                <TrendUp size={12} weight="fill" className="mr-1" />
                {coin.hypeLevel.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ShareNetwork size={14} />
                Network Analysis
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNetwork(!showNetwork)}
                className="h-6 text-xs"
                aria-expanded={showNetwork}
                aria-label={showNetwork ? 'Hide network analysis' : 'Show network analysis'}
              >
                {showNetwork ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            <AnimatePresence>
              {showNetwork && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Total Nodes</div>
                      <div className="font-mono font-semibold">{metrics.totalNodes}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Total Reach</div>
                      <div className="font-mono font-semibold">
                        {(linkAnalysis.totalReach / 1000).toFixed(1)}K
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Virality</div>
                      <div className="font-mono font-semibold">
                        {linkAnalysis.viralityScore.toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Influence</div>
                      <div className="font-mono font-semibold">
                        {metrics.averageInfluence.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="outline" className="text-xs border-primary/30">
                      {metrics.byType.influencer} Influencers
                    </Badge>
                    <Badge variant="outline" className="text-xs border-primary/30">
                      {metrics.byType.community} Communities
                    </Badge>
                    <Badge variant="outline" className="text-xs border-primary/30">
                      {metrics.byType.developer} Devs
                    </Badge>
                    <Badge variant="outline" className="text-xs border-primary/30">
                      {metrics.byType.investor} VCs
                    </Badge>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShow3DVisualizer(true)}
              className="h-8 gap-2 border-primary/30 hover:border-primary glow-border"
            >
              <Cube size={16} />
              View 3D Metrics
            </Button>
            {coin.sourceLinks.slice(0, 5).map((link, idx) => (
              <Button
                key={idx}
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs border border-primary/30 hover:border-primary"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {getSocialIcon(link.type)}
                  {link.type}
                  {link.followers && (
                    <span className="text-muted-foreground">
                      ({(link.followers / 1000).toFixed(0)}K)
                    </span>
                  )}
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
    </>
  )
}

export function NewCoinDiscoveryPanel() {
  const { coins, isLoading, filter, setFilter, minSentiment, setMinSentiment, refreshCoins } =
    useNewCoinDiscovery()
  
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCoins = coins.filter(coin => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      coin.coinName.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query) ||
      coin.description.toLowerCase().includes(query) ||
      coin.tags.some(tag => tag.toLowerCase().includes(query))
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkle size={28} weight="fill" className="text-accent" />
            Coin-Fisher
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            OSINT-powered early detection & sentiment analysis
          </p>
        </div>
        <Button
          onClick={refreshCoins}
          variant="outline"
          size="sm"
          className="gap-2 border-primary/50 hover:border-primary"
          aria-label="Refresh coin discovery data"
        >
          <ArrowsClockwise size={16} weight="bold" />
          Refresh
        </Button>
      </div>

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
        <div className="space-y-6">
          <div className="relative">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, symbol, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glow-border bg-background/50"
            />
          </div>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as LaunchWindow)}>
            <TabsList className="grid w-full grid-cols-4 bg-background/50">
              <TabsTrigger value="24h">24 Hours</TabsTrigger>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-3">
            <Label htmlFor="sentiment-slider" className="text-sm">
              Minimum Sentiment Score: {minSentiment}
            </Label>
            <Slider
              id="sentiment-slider"
              value={[minSentiment]}
              onValueChange={([value]) => setMinSentiment(value)}
              max={100}
              step={5}
              className="w-full"
              aria-label="Minimum sentiment score filter"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {filteredCoins.length} coin{filteredCoins.length !== 1 ? 's' : ''} found
            </span>
            <span className="text-muted-foreground">
              Filter: {filter} | Min Sentiment: {minSentiment}
            </span>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="glow-border bg-card/50 backdrop-blur-sm animate-pulse">
              <CardHeader>
                <div className="h-6 bg-primary/20 rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-primary/20 rounded w-full" />
                  <div className="h-4 bg-primary/20 rounded w-2/3" />
                  <div className="h-4 bg-primary/20 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCoins.length === 0 ? (
        <Card className="glow-border bg-card/50 backdrop-blur-sm p-12 text-center">
          <Sparkle size={48} weight="fill" className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-lg text-muted-foreground">No coins match your filters</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your launch window or sentiment threshold
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredCoins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
