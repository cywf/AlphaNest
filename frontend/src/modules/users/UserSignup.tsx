import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { authEngine } from './authEngine'
import { AVATAR_PRESETS } from './avatarPresets'
import { REGIONS, REGION_NAMES, type Region, type SignupData } from './userTypes'
import { UserPlus, Sparkle } from '@phosphor-icons/react'

interface UserSignupProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export function UserSignup({ onSuccess, onSwitchToLogin }: UserSignupProps) {
  const [formData, setFormData] = useState<SignupData>({
    username: '',
    email: '',
    password: '',
    avatar: AVATAR_PRESETS[0].emoji,
    avatarType: 'preset',
    bio: '',
    region: 'north-america',
  })
  const [selectedAvatarId, setSelectedAvatarId] = useState(AVATAR_PRESETS[0].id)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = authEngine.signup(formData)

      if (result.success) {
        toast.success('Account created successfully!', {
          description: `Welcome to the network, ${formData.username}`,
        })
        onSuccess()
      } else {
        toast.error('Signup failed', {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error('An error occurred during signup')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAvatarSelect = (avatarId: string) => {
    const preset = AVATAR_PRESETS.find((p) => p.id === avatarId)
    if (preset) {
      setSelectedAvatarId(avatarId)
      setFormData((prev) => ({
        ...prev,
        avatar: preset.emoji,
        avatarType: 'preset',
      }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glow-border bg-card/90 backdrop-blur-sm max-w-2xl w-full p-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <UserPlus size={32} className="text-primary" weight="duotone" />
              <h1 className="text-3xl font-bold text-primary">Join The Network</h1>
            </div>
            <p className="text-muted-foreground">
              Create your account and enter ALPHA-N3ST
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  required
                  className="glow-border bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="glow-border bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
                minLength={6}
                className="glow-border bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value as Region }))}>
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
              <Label>Choose Your Avatar</Label>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleAvatarSelect(preset.id)}
                    className={`
                      relative aspect-square rounded-lg p-3 flex items-center justify-center text-3xl
                      transition-all duration-200 hover:scale-110
                      ${selectedAvatarId === preset.id 
                        ? 'glow-border bg-primary/20 ring-2 ring-primary' 
                        : 'border border-border bg-card/50 hover:border-primary/50'
                      }
                    `}
                    title={preset.name}
                  >
                    {preset.emoji}
                    {selectedAvatarId === preset.id && (
                      <div className="absolute -top-1 -right-1">
                        <Sparkle size={16} className="text-accent" weight="fill" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell others about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                className="glow-border bg-background/50 min-h-[80px]"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/200 characters
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full glow-border"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={onSwitchToLogin}
                className="w-full"
              >
                Already have an account? Login
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
