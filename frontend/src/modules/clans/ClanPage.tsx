import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { clanEngine } from './clanEngine'
import { authEngine } from '../users/authEngine'
import { REGION_NAMES } from '../users/userTypes'
import { CLAN_ROLE_NAMES, CLAN_ACTIVITY_NAMES, type Clan, type ClanMember } from './clanTypes'
import { Users, Crown, SignOut, ArrowLeft, Trophy, ChartLine, MapPin, Lightning, User } from '@phosphor-icons/react'

interface ClanPageProps {
  clanId: string
  onBack: () => void
  onViewChat: (clanId: string) => void
}

export function ClanPage({ clanId, onBack, onViewChat }: ClanPageProps) {
  const [clan, setClan] = useState<Clan | null>(null)
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    loadClan()
    const interval = setInterval(loadClan, 5000)
    return () => clearInterval(interval)
  }, [clanId])

  const loadClan = () => {
    const loadedClan = clanEngine.getClan(clanId)
    if (loadedClan) {
      setClan(loadedClan)
      const currentUser = authEngine.getCurrentUser()
      setIsMember(currentUser?.clanId === clanId)
    }
  }

  const handleLeaveClan = () => {
    const result = clanEngine.leaveClan(clanId)
    if (result.success) {
      toast.success('You have left the clan')
      onBack()
    } else {
      toast.error('Failed to leave clan', {
        description: result.error,
      })
    }
  }

  if (!clan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="glow-border bg-card/90 backdrop-blur-sm p-8">
          <p className="text-muted-foreground">Clan not found</p>
        </Card>
      </div>
    )
  }

  const getRoleColor = (role: ClanMember['role']) => {
    switch (role) {
      case 'founder':
        return 'text-accent'
      case 'leader':
        return 'text-primary'
      case 'officer':
        return 'text-secondary'
      default:
        return 'text-foreground'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
          <ArrowLeft size={16} className="mr-2" />
          Back to Directory
        </Button>
      </div>

      <Card className="glow-border-accent bg-card/90 backdrop-blur-sm p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{clan.emblem}</div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-primary">{clan.name}</h1>
                <Badge variant="outline" className="font-bold text-lg px-3">
                  [{clan.tag}]
                </Badge>
                {clan.rank <= 3 && (
                  <Trophy size={24} className="text-accent" weight="fill" />
                )}
              </div>
              <p className="text-xl text-muted-foreground italic">" {clan.motto} "</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">#{clan.rank}</div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
          </div>
        </div>

        <p className="text-foreground mb-6">{clan.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-background/50 border border-border">
            <Users size={24} className="mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{clan.members.length}</div>
            <div className="text-xs text-muted-foreground">Members</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-background/50 border border-border">
            <ChartLine size={24} className="mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold font-mono">{clan.score.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Score</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-background/50 border border-border">
            <MapPin size={24} className="mx-auto mb-2 text-accent" />
            <div className="text-sm font-bold">{REGION_NAMES[clan.region]}</div>
            <div className="text-xs text-muted-foreground">Region HQ</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-background/50 border border-border">
            <Lightning size={24} className="mx-auto mb-2 text-green-500" />
            <div className="text-sm font-bold">{CLAN_ACTIVITY_NAMES[clan.activity]}</div>
            <div className="text-xs text-muted-foreground">Activity</div>
          </div>
        </div>

        <div className="flex gap-3">
          {isMember && (
            <>
              <Button onClick={() => onViewChat(clanId)} className="glow-border">
                <Users size={16} className="mr-2" />
                Clan Chat
              </Button>
              <Button onClick={handleLeaveClan} variant="outline">
                <SignOut size={16} className="mr-2" />
                Leave Clan
              </Button>
            </>
          )}
        </div>
      </Card>

      <Card className="glow-border bg-card/80 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users size={24} className="text-primary" />
          Clan Roster ({clan.members.length})
        </h2>

        <div className="space-y-2">
          {clan.members.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{member.avatar}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{member.username}</span>
                    <Badge variant="outline" className={getRoleColor(member.role)}>
                      {CLAN_ROLE_NAMES[member.role]}
                    </Badge>
                    {member.role === 'founder' && (
                      <Crown size={16} className="text-accent" weight="fill" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary font-mono">{member.score.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {clan.pendingApplications.filter((app) => app.status === 'pending').length > 0 && isMember && (
        <Card className="glow-border bg-card/80 backdrop-blur-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User size={24} className="text-accent" />
            Pending Applications ({clan.pendingApplications.filter((app) => app.status === 'pending').length})
          </h2>

          <div className="space-y-3">
            {clan.pendingApplications
              .filter((app) => app.status === 'pending')
              .map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{app.avatar}</div>
                    <div>
                      <div className="font-bold">{app.username}</div>
                      <div className="text-sm text-muted-foreground">{app.message}</div>
                      <div className="text-xs text-muted-foreground">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        clanEngine.acceptApplication(clanId, app.id)
                        loadClan()
                        toast.success('Application accepted')
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        clanEngine.rejectApplication(clanId, app.id)
                        loadClan()
                        toast.success('Application rejected')
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  )
}
