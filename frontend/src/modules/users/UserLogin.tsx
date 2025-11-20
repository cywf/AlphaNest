import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { authEngine } from './authEngine'
import type { LoginData } from './userTypes'
import { SignIn, Lightning } from '@phosphor-icons/react'

interface UserLoginProps {
  onSuccess: () => void
  onSwitchToSignup: () => void
}

export function UserLogin({ onSuccess, onSwitchToSignup }: UserLoginProps) {
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = authEngine.login(formData)

      if (result.success && result.session) {
        toast.success('Login successful!', {
          description: `Welcome back, ${result.session.username}`,
        })
        onSuccess()
      } else {
        toast.error('Login failed', {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = (username: string) => {
    setFormData({ username, password: 'demo123' })
    setTimeout(() => {
      const result = authEngine.login({ username, password: 'demo123' })
      if (result.success) {
        toast.success('Demo login successful!', {
          description: `Logged in as ${username}`,
        })
        onSuccess()
      }
    }, 100)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glow-border bg-card/90 backdrop-blur-sm max-w-md w-full p-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <SignIn size={32} className="text-primary" weight="duotone" />
              <h1 className="text-3xl font-bold text-primary">Access Network</h1>
            </div>
            <p className="text-muted-foreground">
              Login to access ALPHA-N3ST
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
                className="glow-border bg-background/50"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full glow-border"
              >
                {isSubmitting ? 'Accessing...' : 'Login'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={onSwitchToSignup}
                className="w-full"
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or try demo accounts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('CyberSamurai')}
              className="w-full justify-start"
            >
              <Lightning size={16} className="mr-2" />
              <span className="flex-1 text-left">CyberSamurai (Demo)</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('NeonPhantom')}
              className="w-full justify-start"
            >
              <Lightning size={16} className="mr-2" />
              <span className="flex-1 text-left">NeonPhantom (Demo)</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('QuantumHacker')}
              className="w-full justify-start"
            >
              <Lightning size={16} className="mr-2" />
              <span className="flex-1 text-left">QuantumHacker (Demo)</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
