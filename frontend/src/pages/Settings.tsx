import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Gear, Bell, Palette, Shield, Database, SpeakerHigh, LockKey, GitBranch, ChatCentered, Fingerprint } from '@phosphor-icons/react'
import { soundEngine } from '@/lib/soundEngine'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

export function Settings() {
  const [soundEnabled, setSoundEnabled] = useState(!soundEngine.isSoundMuted())
  const [haptics, setHaptics] = useState(true)
  const [animations, setAnimations] = useState(true)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [showOtpDialog, setShowOtpDialog] = useState(false)

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked)
    soundEngine.setMuted(!checked)
    if (checked) {
      soundEngine.play('success')
    }
  }

  const handleEnable2FA = () => {
    setShowOtpDialog(true)
  }

  const handleVerifyOTP = () => {
    if (otpCode.length === 6) {
      setTwoFAEnabled(true)
      setShowOtpDialog(false)
      setOtpCode('')
    }
  }
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Gear className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Customize your experience</p>
      </div>

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="arb-alerts">Arbitrage Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified of high-profit opportunities</p>
            </div>
            <Switch id="arb-alerts" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="clan-updates">Clan Updates</Label>
              <p className="text-sm text-muted-foreground">Receive clan chat and event notifications</p>
            </div>
            <Switch id="clan-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-coins">New Coin Listings</Label>
              <p className="text-sm text-muted-foreground">Alert when new coins are listed</p>
            </div>
            <Switch id="new-coins" />
          </div>
        </div>
      </Card>

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Appearance
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="animations">Enable Animations</Label>
              <p className="text-sm text-muted-foreground">Neon glow effects and transitions</p>
            </div>
            <Switch id="animations" checked={animations} onCheckedChange={setAnimations} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="scanlines">Scanline Effect</Label>
              <p className="text-sm text-muted-foreground">Retro CRT screen overlay</p>
            </div>
            <Switch id="scanlines" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-effects">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">UI interaction sounds</p>
            </div>
            <Switch id="sound-effects" checked={soundEnabled} onCheckedChange={handleSoundToggle} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="haptics">Haptic Feedback</Label>
              <p className="text-sm text-muted-foreground">Vibration on mobile devices</p>
            </div>
            <Switch id="haptics" checked={haptics} onCheckedChange={setHaptics} />
          </div>
        </div>
      </Card>

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Privacy & Security
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-visibility">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Show your profile on leaderboards</p>
            </div>
            <Switch id="profile-visibility" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-stats">Show Trading Stats</Label>
              <p className="text-sm text-muted-foreground">Display arbitrage volume publicly</p>
            </div>
            <Switch id="show-stats" defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <LockKey className="h-5 w-5 text-primary" />
          Two-Factor Authentication (2FA)
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Status</Label>
              <p className="text-sm text-muted-foreground">
                {twoFAEnabled ? 'Two-factor authentication is enabled' : 'Add extra security to your account'}
              </p>
            </div>
            <Badge variant={twoFAEnabled ? 'default' : 'outline'} className={twoFAEnabled ? 'bg-chart-2/20 text-chart-2 border-chart-2/30' : ''}>
              {twoFAEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          
          {!twoFAEnabled ? (
            <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
              <DialogTrigger asChild>
                <Button onClick={handleEnable2FA} className="w-full">
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Enable 2FA
                </Button>
              </DialogTrigger>
              <DialogContent className="glow-border bg-card/95 backdrop-blur-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <LockKey className="h-5 w-5 text-primary" />
                    Set Up Two-Factor Authentication
                  </DialogTitle>
                  <DialogDescription>
                    Scan the QR code with your authenticator app and enter the 6-digit code
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="flex justify-center p-6 bg-background/50 rounded-lg">
                    <div className="w-48 h-48 bg-muted/30 border-2 border-primary/30 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-2">▦</div>
                        <p className="text-xs text-muted-foreground">QR Code Placeholder</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otp-code">Enter 6-Digit Code</Label>
                    <Input
                      id="otp-code"
                      placeholder="000000"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-2xl tracking-widest font-mono"
                      maxLength={6}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleVerifyOTP} 
                    disabled={otpCode.length !== 6}
                    className="w-full"
                  >
                    Verify & Enable
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button 
              onClick={() => setTwoFAEnabled(false)} 
              variant="outline"
              className="w-full"
            >
              Disable 2FA
            </Button>
          )}
        </div>
      </Card>

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          Integrations
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label>GitHub</Label>
                <p className="text-xs text-muted-foreground">Connect your GitHub account</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Connect</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-chart-2/20 flex items-center justify-center">
                <ChatCentered className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <Label>OpenAI ChatKit</Label>
                <p className="text-xs text-muted-foreground">AI-powered trading assistant</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Connect</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <Label>Tailscale</Label>
                <p className="text-xs text-muted-foreground">Secure network connectivity</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Connect</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-chart-4/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <Label>ZeroTier</Label>
                <p className="text-xs text-muted-foreground">Virtual network connection</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Connect</Button>
          </div>
        </div>
      </Card>

      <Card className="glow-border bg-card/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Data Management
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Clear Cache</Label>
              <p className="text-sm text-muted-foreground">Remove temporary data</p>
            </div>
            <Button variant="outline" size="sm">Clear</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Export Data</Label>
              <p className="text-sm text-muted-foreground">Download your trading history</p>
            </div>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline">Reset to Default</Button>
        <Button className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
