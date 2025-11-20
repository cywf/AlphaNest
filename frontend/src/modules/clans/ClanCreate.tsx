import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { clanEngine } from './clanEngine'
import { REGIONS, REGION_NAMES, type Region } from '../users/userTypes'
import type { ClanCreateData } from './clanTypes'
import { Users, Plus, ArrowLeft } from '@phosphor-icons/react'

interface ClanCreateProps {
  onSuccess: (clanId: string) => void
  onCancel: () => void
}

export function ClanCreate({ onSuccess, onCancel }: ClanCreateProps) {
  const [formData, setFormData] = useState<ClanCreateData>({
    name: '',
    tag: '',
    description: '',
    motto: '',
    region: 'north-america',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = clanEngine.createClan(formData)

      if (result.success && result.clan) {
        toast.success('Clan created successfully!', {
          description: `Welcome to ${result.clan.name}`,
        })
        onSuccess(result.clan.id)
      } else {
        toast.error('Failed to create clan', {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error('An error occurred while creating the clan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glow-border bg-card/90 backdrop-blur-sm p-8">
        <div className="space-y-6">
          <div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="mb-4">
              <ArrowLeft size={16} className="mr-2" />
              Back to Directory
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <Users size={32} className="text-primary" weight="duotone" />
              <h1 className="text-3xl font-bold text-primary">Create Your Clan</h1>
            </div>
            <p className="text-muted-foreground">
              Found your own clan and compete in the global Clan Warz
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clan-name">Clan Name *</Label>
                <Input
                  id="clan-name"
                  type="text"
                  placeholder="e.g., Neon Samurai"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="glow-border bg-background/50"
                  maxLength={30}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.name.length}/30 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clan-tag">Clan Tag * (3-6 chars)</Label>
                <Input
                  id="clan-tag"
                  type="text"
                  placeholder="e.g., NEON"
                  value={formData.tag}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value.toUpperCase() }))}
                  required
                  className="glow-border bg-background/50 font-mono"
                  minLength={3}
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.tag.length}/6 characters
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clan-region">Region HQ *</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value as Region }))}
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
              <Label htmlFor="clan-motto">Clan Motto *</Label>
              <Input
                id="clan-motto"
                type="text"
                placeholder="e.g., Strike fast, profit faster"
                value={formData.motto}
                onChange={(e) => setFormData((prev) => ({ ...prev, motto: e.target.value }))}
                required
                className="glow-border bg-background/50"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {formData.motto.length}/60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clan-description">Description *</Label>
              <Textarea
                id="clan-description"
                placeholder="Describe your clan's purpose and values..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
                className="glow-border bg-background/50 min-h-[120px]"
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.description.length}/300 characters
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 glow-border"
              >
                {isSubmitting ? 'Creating...' : (
                  <>
                    <Plus size={16} className="mr-2" />
                    Create Clan
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
