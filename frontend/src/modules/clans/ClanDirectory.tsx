import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { clanEngine } from './clanEngine'
import { REGION_NAMES } from '../users/userTypes'
import { CLAN_ACTIVITY_NAMES, type Region, type ClanActivity } from './clanTypes'
import type { Clan } from './clanTypes'
import { Users, MagnifyingGlass, Plus, Crown, MapPin, ChartLine, Lightning } from '@phosphor-icons/react'

interface ClanDirectoryProps {
  onCreateClan: () => void
  onViewClan: (clanId: string) => void
  onApplyToClan: (clanId: string) => void
}

export function ClanDirectory({ onCreateClan, onViewClan, onApplyToClan }: ClanDirectoryProps) {
  const [clans, setClans] = useState<Clan[]>([])
  const [filteredClans, setFilteredClans] = useState<Clan[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState<Region | 'all'>('all')
  const [activityFilter, setActivityFilter] = useState<ClanActivity | 'all'>('all')
  const [rankFilter, setRankFilter] = useState<'all' | 'top100' | 'top500'>('all')
  const [sortBy, setSortBy] = useState<'rank' | 'members' | 'score'>('rank')

  useEffect(() => {
    loadClans()
    const interval = setInterval(loadClans, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    applyFilters()
  }, [clans, searchQuery, regionFilter, activityFilter, rankFilter, sortBy])

  const loadClans = () => {
    const allClans = clanEngine.getAllClans()
    setClans(allClans)
  }

  const applyFilters = () => {
    let filtered = [...clans]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (clan) =>
          clan.name.toLowerCase().includes(query) ||
          clan.tag.toLowerCase().includes(query) ||
          clan.description.toLowerCase().includes(query)
      )
    }

    if (regionFilter !== 'all') {
      filtered = filtered.filter((clan) => clan.region === regionFilter)
    }

    if (activityFilter !== 'all') {
      filtered = filtered.filter((clan) => clan.activity === activityFilter)
    }

    if (rankFilter === 'top100') {
      filtered = filtered.filter((clan) => clan.rank <= 100)
    } else if (rankFilter === 'top500') {
      filtered = filtered.filter((clan) => clan.rank <= 500)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rank':
          return a.rank - b.rank
        case 'members':
          return b.members.length - a.members.length
        case 'score':
          return b.score - a.score
        default:
          return a.rank - b.rank
      }
    })

    setFilteredClans(filtered)
  }

  const getActivityColor = (activity: ClanActivity) => {
    switch (activity) {
      case 'very-active':
        return 'text-green-500'
      case 'active':
        return 'text-cyan-500'
      case 'moderate':
        return 'text-yellow-500'
      case 'low':
        return 'text-gray-500'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glow-border bg-card/90 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users size={32} className="text-primary" weight="duotone" />
            <div>
              <h1 className="text-2xl font-bold">Clan Directory</h1>
              <p className="text-sm text-muted-foreground">{clans.length} clans registered</p>
            </div>
          </div>
          <Button onClick={onCreateClan} className="glow-border">
            <Plus size={16} className="mr-2" />
            Create Clan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glow-border bg-background/50"
              />
            </div>
          </div>

          <Select value={regionFilter} onValueChange={(value) => setRegionFilter(value as Region | 'all')}>
            <SelectTrigger className="glow-border bg-background/50">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {Object.entries(REGION_NAMES).map(([key, name]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activityFilter} onValueChange={(value) => setActivityFilter(value as ClanActivity | 'all')}>
            <SelectTrigger className="glow-border bg-background/50">
              <SelectValue placeholder="Activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              {Object.entries(CLAN_ACTIVITY_NAMES).map(([key, name]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={rankFilter} onValueChange={(value) => setRankFilter(value as 'all' | 'top100' | 'top500')}>
            <SelectTrigger className="glow-border bg-background/50">
              <SelectValue placeholder="Rank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ranks</SelectItem>
              <SelectItem value="top100">Top 100</SelectItem>
              <SelectItem value="top500">Top 500</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'rank' | 'members' | 'score')}>
            <SelectTrigger className="glow-border bg-background/50 w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Sort by Rank</SelectItem>
              <SelectItem value="members">Sort by Members</SelectItem>
              <SelectItem value="score">Sort by Power Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClans.map((clan) => (
          <Card
            key={clan.id}
            className="glow-border bg-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-200 cursor-pointer"
            onClick={() => onViewClan(clan.id)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{clan.emblem}</div>
                  <div>
                    <div className="font-bold text-lg flex items-center gap-2">
                      {clan.name}
                      {clan.rank <= 3 && (
                        <Crown size={16} className="text-accent" weight="fill" />
                      )}
                    </div>
                    <div className="text-sm text-primary font-mono">[{clan.tag}]</div>
                  </div>
                </div>
                <Badge variant="outline" className="font-bold">
                  #{clan.rank}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {clan.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users size={16} />
                    <span>Members</span>
                  </div>
                  <span className="font-bold">{clan.members.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ChartLine size={16} />
                    <span>Score</span>
                  </div>
                  <span className="font-bold text-primary font-mono">
                    {clan.score.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} />
                    <span>Region</span>
                  </div>
                  <span>{REGION_NAMES[clan.region]}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lightning size={16} />
                    <span>Activity</span>
                  </div>
                  <span className={getActivityColor(clan.activity)}>
                    {CLAN_ACTIVITY_NAMES[clan.activity]}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation()
                  onApplyToClan(clan.id)
                }}
              >
                Apply to Join
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredClans.length === 0 && (
        <Card className="glow-border bg-card/50 backdrop-blur-sm p-12 text-center">
          <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">No Clans Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search filters' : 'Be the first to create a clan!'}
          </p>
          <Button onClick={onCreateClan} className="glow-border">
            <Plus size={16} className="mr-2" />
            Create Clan
          </Button>
        </Card>
      )}
    </div>
  )
}
