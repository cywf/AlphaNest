import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { authEngine } from './authEngine'
import { AVATAR_PRESETS } from './avatarPresets'
import { REGIONS, REGION_NAMES, SHOP_THEME_NAMES, type Region, type ShopTheme, type User } from './userTypes'
import { SHOP_THEME_CONFIGS } from './shopThemes'
import { UserCircle, MapPin, Palette, Crown, Pencil, Check, ChartLineUp, Users } from '@phosphor-icons/react'

interface UserProfileProps {
  onNavigateToShop: () => void
  onNavigateToClan: () => void
}

export function UserProfile({ onNavigateToShop, onNavigateToClan }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    bio: '',
    region: 'north-america' as Region,
    shopTheme: 'cyan' as ShopTheme,
  })

  useEffect(() => {
    const currentUser = authEngine.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setEditData({
        bio: currentUser.bio,
        region: currentUser.region,
        shopTheme: currentUser.shopTheme,
      })
    }
  }, [])

  const handleSave = () => {
    if (!user) return

    const result = authEngine.updateUser(user.id, {
      bio: editData.bio,
      region: editData.region,
      shopTheme: editData.shopTheme,
    })

    if (result.success && result.user) {
      setUser(result.user)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } else {
      toast.error('Failed to update profile', {
        description: result.error,
      })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glow-border bg-card/90 backdrop-blur-sm p-8">
          <p className="text-muted-foreground">Not logged in</p>
        </Card>
      </div>
    )
  }

  const themeConfig = SHOP_THEME_CONFIGS[user.shopTheme]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="glow-border bg-card/90 backdrop-blur-sm p-8">
          <div className="flex items-start gap-6">
            <div className="text-6xl">{user.avatar}</div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-primary">{user.username}</h1>
                  {user.clanTag && (
                    <span className="px-3 py-1 rounded bg-accent/20 border border-accent text-accent text-sm font-bold">
                      [{user.clanTag}]
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">{user.email}</p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span>{REGION_NAMES[user.region]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-primary" />
                  <span>{SHOP_THEME_NAMES[user.shopTheme]}</span>
                </div>
              </div>

              <p className="text-foreground">{user.bio || 'No bio set'}</p>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'secondary' : 'default'}
                  size="sm"
                >
                  {isEditing ? (
                    <>
                      <Check size={16} className="mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Pencil size={16} className="mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
                <Button onClick={onNavigateToShop} variant="outline" size="sm">
                  <Crown size={16} className="mr-2" />
                  My Market Booth
                </Button>
                {user.clanId && (
                  <Button onClick={onNavigateToClan} variant="outline" size="sm">
                    <Users size={16} className="mr-2" />
                    My Clan
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {isEditing && (
          <Card className="glow-border-accent bg-card/90 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserCircle size={24} className="text-accent" />
              Edit Profile
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-bio">Bio</Label>
                <Textarea
                  id="edit-bio"
                  value={editData.bio}
                  onChange={(e) => setEditData((prev) => ({ ...prev, bio: e.target.value }))}
                  className="glow-border bg-background/50 min-h-[100px]"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {editData.bio.length}/200 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-region">Region</Label>
                <Select
                  value={editData.region}
                  onValueChange={(value) => setEditData((prev) => ({ ...prev, region: value as Region }))}
                >
                  <SelectTrigger className="glow-border bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {REGION_NAMES[region]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Shop Theme</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(SHOP_THEME_CONFIGS).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setEditData((prev) => ({ ...prev, shopTheme: key as ShopTheme }))}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200
                        ${editData.shopTheme === key
                          ? 'border-primary bg-primary/10 scale-105'
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                      style={{
                        boxShadow: editData.shopTheme === key ? `0 0 20px ${config.glowColor}` : 'none',
                      }}
                    >
                      <div className="font-bold mb-1">{config.name}</div>
                      <div className="flex gap-2 justify-center">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ background: config.primaryColor }}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ background: config.secondaryColor }}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ background: config.accentColor }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} className="w-full glow-border">
                <Check size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <ChartLineUp size={24} className="text-primary" />
              <h3 className="font-bold">Total Score</h3>
            </div>
            <p className="text-3xl font-bold text-primary font-mono">
              {user.score.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Combined points</p>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <ChartLineUp size={24} className="text-primary" />
              <h3 className="font-bold">Ranked Score</h3>
            </div>
            <p className="text-3xl font-bold text-primary font-mono">
              {user.rankedScore.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Real trades</p>
          </Card>

          <Card className="glow-border-accent bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <ChartLineUp size={24} className="text-accent" />
              <h3 className="font-bold">Casual Score</h3>
            </div>
            <p className="text-3xl font-bold text-accent font-mono">
              {user.casualScore.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Virtual trades</p>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <ChartLineUp size={24} className="text-secondary" />
              <h3 className="font-bold">Arbitrage Volume</h3>
            </div>
            <p className="text-3xl font-bold text-secondary font-mono">
              ${(user.arbitrageVolume / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total traded</p>
          </Card>

          <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users size={24} className="text-accent" />
              <h3 className="font-bold">Clan Status</h3>
            </div>
            <p className="text-3xl font-bold text-accent">
              {user.clanId ? user.clanTag : '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {user.clanId ? 'Member' : 'Not in clan'}
            </p>
          </Card>
        </div>

        <Card
          className="glow-border bg-card/50 backdrop-blur-sm p-6"
          style={{
            borderColor: themeConfig.primaryColor,
            boxShadow: `0 0 20px ${themeConfig.glowColor}`,
          }}
        >
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Crown size={24} style={{ color: themeConfig.primaryColor }} />
            Shop Theme Preview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: `${themeConfig.primaryColor}20`,
                borderColor: themeConfig.primaryColor,
              }}
            >
              <div className="font-bold mb-2">Primary</div>
              <div className="text-sm text-muted-foreground">Main accent color</div>
            </div>
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: `${themeConfig.secondaryColor}20`,
                borderColor: themeConfig.secondaryColor,
              }}
            >
              <div className="font-bold mb-2">Secondary</div>
              <div className="text-sm text-muted-foreground">Supporting color</div>
            </div>
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: `${themeConfig.accentColor}20`,
                borderColor: themeConfig.accentColor,
              }}
            >
              <div className="font-bold mb-2">Accent</div>
              <div className="text-sm text-muted-foreground">Highlight color</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
