import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { clanWarzEngine } from './clanWarzEngine'
import { REGION_NAMES, type Region } from '../users/userTypes'
import { REGION_POSITIONS } from './clanWarzTypes'
import type { ClanWarzState, UserPin, ClanWarzLeaderboard } from './clanWarzTypes'
import { Globe, Trophy, MapPin, Lightning, Users, Crown } from '@phosphor-icons/react'

export function ClanWarzMap() {
  const [warzState, setWarzState] = useState<ClanWarzState | null>(null)
  const [leaderboards, setLeaderboards] = useState<ClanWarzLeaderboard | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [hoveredPin, setHoveredPin] = useState<UserPin | null>(null)

  useEffect(() => {
    updateState()
    const interval = setInterval(updateState, 8000)
    return () => clearInterval(interval)
  }, [])

  const updateState = () => {
    const state = clanWarzEngine.calculateClanWarzState()
    const boards = clanWarzEngine.getLeaderboards()
    setWarzState(state)
    setLeaderboards(boards)
  }

  if (!warzState || !leaderboards) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="glow-border bg-card/90 backdrop-blur-sm p-8">
          <p className="text-muted-foreground">Loading Clan Warz...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="glow-border-accent bg-card/90 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe size={32} className="text-accent" weight="duotone" />
            <div>
              <h1 className="text-3xl font-bold text-accent">Clan Warz</h1>
              <p className="text-sm text-muted-foreground">
                Global real-time clan territorial control
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Last Updated</div>
            <div className="text-sm font-mono">
              {new Date(warzState.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glow-border bg-black/90 backdrop-blur-sm p-6 relative overflow-hidden">
            <div className="grid-bg absolute inset-0 opacity-20" />
            
            <div className="relative" style={{ paddingBottom: '60%', minHeight: '400px' }}>
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'drop-shadow(0 0 10px oklch(0.75 0.15 195 / 0.3))' }}
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="oklch(0.75 0.15 195)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="oklch(0.75 0.15 195)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {Object.entries(REGION_POSITIONS).map(([region, pos]) => {
                  const regionData = warzState.regionDominance[region as Region]
                  const isSelected = selectedRegion === region

                  return (
                    <g
                      key={region}
                      onClick={() => setSelectedRegion(region as Region)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isSelected ? 8 : 6}
                        fill={regionData.color}
                        opacity={0.3}
                        filter="url(#glow)"
                      />
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isSelected ? 5 : 3}
                        fill={regionData.color}
                        opacity={0.8}
                        stroke={regionData.color}
                        strokeWidth="0.5"
                      />
                      
                      {warzState.hotZones.some((hz) => hz.region === region) && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="4"
                          fill="none"
                          stroke="oklch(0.70 0.25 340)"
                          strokeWidth="0.5"
                          opacity="0.8"
                        >
                          <animate
                            attributeName="r"
                            from="4"
                            to="10"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.8"
                            to="0"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  )
                })}

                {warzState.userPins.map((pin) => (
                  <g
                    key={pin.userId}
                    onMouseEnter={() => setHoveredPin(pin)}
                    onMouseLeave={() => setHoveredPin(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={pin.position.x}
                      cy={pin.position.y}
                      r="1.5"
                      fill="url(#pinGlow)"
                      opacity={0.6 + pin.glowIntensity * 0.4}
                    />
                    <circle
                      cx={pin.position.x}
                      cy={pin.position.y}
                      r="0.5"
                      fill="oklch(0.85 0.15 195)"
                      opacity="1"
                    />
                  </g>
                ))}

                {warzState.clanInfluence.slice(0, 5).map((influence) => {
                  const basePos = REGION_POSITIONS[influence.primaryRegion]
                  return (
                    <g key={influence.clanId}>
                      <circle
                        cx={basePos.x}
                        cy={basePos.y}
                        r={influence.influenceRadius}
                        fill="none"
                        stroke={influence.color}
                        strokeWidth="0.3"
                        opacity="0.4"
                        strokeDasharray="2,2"
                      />
                    </g>
                  )
                })}
              </svg>

              {hoveredPin && (
                <div
                  className="absolute glow-border bg-card/95 backdrop-blur-sm p-3 rounded-lg pointer-events-none"
                  style={{
                    left: `${hoveredPin.position.x}%`,
                    top: `${hoveredPin.position.y}%`,
                    transform: 'translate(-50%, -120%)',
                    zIndex: 100,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{hoveredPin.avatar}</span>
                    <div>
                      <div className="font-bold text-sm">{hoveredPin.username}</div>
                      {hoveredPin.clanTag && (
                        <div className="text-xs text-primary">[{hoveredPin.clanTag}]</div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Score: {hoveredPin.score.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: REGION_POSITIONS ? 'oklch(0.75 0.15 195)' : '' }} />
                Active Zone
              </Badge>
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'oklch(0.70 0.25 340)' }} />
                Hot Zone
              </Badge>
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'oklch(0.80 0.15 80)' }} />
                Dominated
              </Badge>
            </div>
          </Card>

          {selectedRegion && (
            <Card className="glow-border-accent bg-card/90 backdrop-blur-sm p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MapPin size={24} className="text-accent" />
                  {REGION_NAMES[selectedRegion]}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRegion(null)}>
                  Close
                </Button>
              </div>

              <div className="space-y-3">
                {warzState.regionDominance[selectedRegion].clanPresence.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No clan presence in this region</p>
                ) : (
                  warzState.regionDominance[selectedRegion].clanPresence.map((presence, index) => (
                    <div
                      key={presence.clanId}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{presence.clanEmblem}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">[{presence.clanTag}]</span>
                            {index === 0 && <Crown size={16} className="text-accent" weight="fill" />}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {presence.memberCount} members
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary font-mono">
                          {presence.percentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {presence.score.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="glow-border bg-card/90 backdrop-blur-sm">
            <Tabs defaultValue="global">
              <div className="p-4 border-b border-border">
                <TabsList className="w-full">
                  <TabsTrigger value="global" className="flex-1">
                    <Trophy size={16} className="mr-2" />
                    Global
                  </TabsTrigger>
                  <TabsTrigger value="regional" className="flex-1">
                    <MapPin size={16} className="mr-2" />
                    Regional
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="global" className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                {leaderboards.global.slice(0, 20).map((ranking) => (
                  <div
                    key={ranking.clanId}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-bold text-muted-foreground w-6">
                        #{ranking.rank}
                      </div>
                      <span className="text-xl">{ranking.clanEmblem}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">[{ranking.clanTag}]</span>
                          {ranking.rank <= 3 && <Crown size={14} className="text-accent" weight="fill" />}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {ranking.memberCount} members • {ranking.regions.length} regions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary font-mono text-sm">
                        {ranking.powerRating.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Power</div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="regional" className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {Object.entries(leaderboards.regional).map(([region, rankings]) => (
                  rankings.length > 0 && (
                    <div key={region}>
                      <h4 className="text-sm font-bold text-muted-foreground mb-2">
                        {REGION_NAMES[region as Region]}
                      </h4>
                      <div className="space-y-2">
                        {rankings.slice(0, 3).map((ranking) => (
                          <div
                            key={ranking.clanId}
                            className="flex items-center justify-between p-2 rounded bg-background/30"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-muted-foreground w-4">
                                #{ranking.rank}
                              </span>
                              <span>{ranking.clanEmblem}</span>
                              <span className="text-sm font-bold">[{ranking.clanTag}]</span>
                            </div>
                            <span className="text-xs font-mono text-primary">
                              {ranking.score.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
