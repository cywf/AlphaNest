import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ChartLine,
  Coins,
  Warning,
  Detective,
  Shield,
  MapTrifold,
  ShoppingCart,
  TrendUp,
  Users,
  Trophy,
  Lightning,
  Target,
  Pulse,
  Drop,
} from '@phosphor-icons/react'
import { authEngine } from '@/modules/users/authEngine'
import { clanEngine } from '@/modules/clans/clanEngine'
import { MiniMapNav } from '@/components/HUD/MiniMapNav'
import { BlockchainActivityMap } from '@/components/dashboard/BlockchainActivityMap'
import { ActivityWidget } from '@/components/dashboard/ActivityWidget'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface DashboardProps {
  onNavigate: (page: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const currentUser = authEngine.getCurrentUser()
  const userClan = currentUser?.clanId ? clanEngine.getClan(currentUser.clanId) : null
  
  const allUsers = authEngine.getAllUsers()
  const sortedUsers = [...allUsers].sort((a, b) => b.score - a.score)
  const userRank = currentUser ? sortedUsers.findIndex(u => u.id === currentUser.id) + 1 : 0

  const [liveStats, setLiveStats] = useState({
    activeOps: 127,
    networkLoad: 73,
    hotAlerts: 8,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats({
        activeOps: Math.floor(Math.random() * 50) + 100,
        networkLoad: Math.floor(Math.random() * 30) + 60,
        hotAlerts: Math.floor(Math.random() * 10) + 3,
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const quickLinks = [
    {
      id: 'arbitrage',
      title: 'ArbScan',
      description: 'Find real-time price differences',
      icon: <ChartLine className="h-8 w-8" />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
    {
      id: 'new-coins',
      title: 'Coin-Fisher',
      description: 'Track newly listed tokens',
      icon: <Coins className="h-8 w-8" />,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
      borderColor: 'border-chart-2/30',
    },
    {
      id: 'stak3z',
      title: 'STAK3Z',
      description: 'Liquidity pools & staking',
      icon: <Drop className="h-8 w-8" />,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/30',
    },
    {
      id: 'mark3t-sim',
      title: 'MARK3T-SIM',
      description: 'Virtual trading arena',
      icon: <Lightning className="h-8 w-8" />,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30',
    },
    {
      id: 'naughty-coins',
      title: 'SK3TCHY-C0INS',
      description: 'High volatility alerts',
      icon: <Warning className="h-8 w-8" />,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30',
    },
    {
      id: 'scam-wallets',
      title: 'SCAM-WALL3TS',
      description: 'Intelligence & tracking',
      icon: <Detective className="h-8 w-8" />,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
    },
    {
      id: 'clans',
      title: 'Clans',
      description: 'Join forces with traders',
      icon: <Shield className="h-8 w-8" />,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/30',
    },
    {
      id: 'clan-warz',
      title: 'Clan Warz',
      description: 'Territory domination map',
      icon: <MapTrifold className="h-8 w-8" />,
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
      borderColor: 'border-chart-5/30',
    },
    {
      id: 'market',
      title: 'Market',
      description: 'Upgrades & customization',
      icon: <ShoppingCart className="h-8 w-8" />,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
      borderColor: 'border-chart-4/30',
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      description: 'Real-time intel feed',
      icon: <Pulse className="h-8 w-8" />,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
      borderColor: 'border-chart-3/30',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-primary drop-shadow-[0_0_20px_rgba(99,220,255,0.5)]">
          Command Center
        </h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="text-primary font-semibold">{currentUser?.username}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActivityWidget
          title="Total Score"
          value={currentUser?.score.toLocaleString() || '0'}
          icon={<Trophy className="h-5 w-5" />}
          color="text-chart-4"
          trend="+12%"
          delay={0}
        />
        <ActivityWidget
          title="Active Operations"
          value={liveStats.activeOps}
          icon={<Lightning className="h-5 w-5" />}
          color="text-primary"
          trend="LIVE"
          delay={100}
        />
        <ActivityWidget
          title="Network Load"
          value={`${liveStats.networkLoad}%`}
          icon={<Pulse className="h-5 w-5" />}
          color="text-chart-2"
          trend={liveStats.networkLoad > 80 ? 'HIGH' : 'NORMAL'}
          delay={200}
        />
        <ActivityWidget
          title="Hot Alerts"
          value={liveStats.hotAlerts}
          icon={<Target className="h-5 w-5" />}
          color="text-accent"
          trend="⚡"
          delay={300}
        />
      </div>

      <BlockchainActivityMap />

      {userClan && (
        <Card className="glow-border-accent bg-card/50 backdrop-blur-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="h-6 w-6 text-secondary" />
                {userClan.name}
                <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                  [{userClan.tag}]
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{userClan.motto}</p>
            </div>
            <Button
              size="sm"
              onClick={() => onNavigate('clan-page')}
              className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30"
            >
              View Clan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-muted-foreground">Clan Rank</span>
              <p className="text-xl font-bold">#{userClan.rank}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Total Score</span>
              <p className="text-xl font-bold">{userClan.score.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Members</span>
              <p className="text-xl font-bold">{userClan.members.length}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Leaderboard Progress</span>
              <span className="text-primary font-medium">
                {Math.min(100, Math.floor((userClan.score / 100000) * 100))}%
              </span>
            </div>
            <Progress
              value={Math.min(100, Math.floor((userClan.score / 100000) * 100))}
              className="h-2"
            />
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-accent">◈</span>
          Quick Access
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Card
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={cn(
                'cursor-pointer group transition-all duration-300',
                'bg-card/50 backdrop-blur-sm border-2 hover:scale-105',
                'hover:shadow-lg p-6',
                link.borderColor
              )}
            >
              <div className={cn('mb-4 transition-transform group-hover:scale-110', link.bgColor, 'w-16 h-16 rounded-lg flex items-center justify-center')}>
                <span className={link.color}>{link.icon}</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{link.title}</h3>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendUp className="h-5 w-5 text-primary" />
              System Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <span className="text-sm">Arbitrage Scanner</span>
                <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <span className="text-sm">New Coin Detector</span>
                <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <span className="text-sm">Wallet Intelligence</span>
                <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <span className="text-sm">Clan Warz Engine</span>
                <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">Online</Badge>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <MiniMapNav onOpenFullMap={() => onNavigate('clan-warz')} />
        </div>
      </div>
    </div>
  )
}
