import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { clanEngine } from './clanEngine'
import { authEngine } from '../users/authEngine'
import type { Clan } from './clanTypes'
import { UserPlus, ArrowLeft } from '@phosphor-icons/react'

interface ClanApplyProps {
  clan: Clan
  onSuccess: () => void
  onCancel: () => void
}

export function ClanApply({ clan, onSuccess, onCancel }: ClanApplyProps) {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentUser = authEngine.getCurrentUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = clanEngine.applyToClan(clan.id, message)

      if (result.success) {
        toast.success('Application submitted!', {
          description: `Your application to ${clan.name} has been sent`,
        })
        onSuccess()
      } else {
        toast.error('Failed to apply', {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error('An error occurred while applying')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentUser) {
    return (
      <Card className="glow-border bg-card/90 backdrop-blur-sm p-8 text-center">
        <p className="text-muted-foreground">You must be logged in to apply to a clan</p>
      </Card>
    )
  }

  if (currentUser.clanId) {
    return (
      <Card className="glow-border bg-card/90 backdrop-blur-sm p-8 text-center">
        <p className="text-muted-foreground">You are already in a clan</p>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glow-border bg-card/90 backdrop-blur-sm p-8">
        <div className="space-y-6">
          <div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="mb-4">
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <UserPlus size={32} className="text-primary" weight="duotone" />
              <h1 className="text-3xl font-bold text-primary">Apply to {clan.name}</h1>
            </div>
            <p className="text-muted-foreground">
              Send an application to join [{clan.tag}]
            </p>
          </div>

          <div className="p-4 rounded-lg bg-background/50 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-4xl">{clan.emblem}</div>
              <div>
                <div className="font-bold text-lg">{clan.name} [{clan.tag}]</div>
                <div className="text-sm text-muted-foreground italic">"{clan.motto}"</div>
              </div>
            </div>
            <p className="text-sm mt-2">{clan.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="application-message">Application Message *</Label>
              <Textarea
                id="application-message"
                placeholder="Introduce yourself and explain why you want to join this clan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="glow-border bg-background/50 min-h-[150px]"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {message.length}/500 characters
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="flex-1 glow-border"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
