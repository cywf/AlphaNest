import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { clanEngine } from './clanEngine'
import { authEngine } from '../users/authEngine'
import { CLAN_CHAT_CHANNELS, CLAN_CHAT_CHANNEL_NAMES, CLAN_CHAT_CHANNEL_DESCRIPTIONS, type ClanChatChannel, type ClanChatMessage } from './clanTypes'
import { ArrowLeft, PaperPlaneRight, Chat } from '@phosphor-icons/react'

interface ClanChatProps {
  clanId: string
  onBack: () => void
}

export function ClanChat({ clanId, onBack }: ClanChatProps) {
  const [messages, setMessages] = useState<Record<ClanChatChannel, ClanChatMessage[]>>({
    general: [],
    strategy: [],
    'intel-feed': [],
    trades: [],
    'warz-planning': [],
    'off-topic': [],
    council: [],
  })
  const [currentChannel, setCurrentChannel] = useState<ClanChatChannel>('general')
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 3000)
    return () => clearInterval(interval)
  }, [clanId])

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentChannel])

  const loadMessages = () => {
    const newMessages: Record<ClanChatChannel, ClanChatMessage[]> = {
      general: [],
      strategy: [],
      'intel-feed': [],
      trades: [],
      'warz-planning': [],
      'off-topic': [],
      council: [],
    }

    CLAN_CHAT_CHANNELS.forEach((channel) => {
      newMessages[channel] = clanEngine.getMessagesForClan(clanId, channel)
    })

    setMessages(newMessages)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMessage.trim()) return

    const result = clanEngine.sendChatMessage(clanId, currentChannel, inputMessage)

    if (result.success) {
      setInputMessage('')
      loadMessages()
    } else {
      toast.error('Failed to send message', {
        description: result.error,
      })
    }
  }

  const currentUser = authEngine.getCurrentUser()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Clan
        </Button>
      </div>

      <Card className="glow-border bg-card/90 backdrop-blur-sm">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Chat size={32} className="text-primary" weight="duotone" />
            <div>
              <h1 className="text-2xl font-bold">Clan Chat</h1>
              <p className="text-sm text-muted-foreground">Communicate with your clan members</p>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-64 border-r border-border px-4 py-6 space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Channels</h3>
            {CLAN_CHAT_CHANNELS.map((channel) => (
              <button
                key={channel}
                onClick={() => setCurrentChannel(channel)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  currentChannel === channel
                    ? 'bg-primary/20 text-primary border-l-4 border-primary'
                    : 'hover:bg-muted/50 text-foreground border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono">{CLAN_CHAT_CHANNEL_NAMES[channel]}</span>
                  {messages[channel].length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-bold">
                      {messages[channel].length}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold">{CLAN_CHAT_CHANNEL_NAMES[currentChannel]}</h2>
              <p className="text-xs text-muted-foreground">{CLAN_CHAT_CHANNEL_DESCRIPTIONS[currentChannel]}</p>
            </div>

            <div className="flex-1 h-[500px] overflow-y-auto p-6 space-y-3">
              {messages[currentChannel].length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No messages in this channel yet
                </div>
              ) : (
                messages[currentChannel].map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.userId === currentUser?.id ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="text-2xl flex-shrink-0">{msg.avatar}</div>
                    <div
                      className={`flex-1 max-w-[70%] ${msg.userId === currentUser?.id ? 'text-right' : ''}`}
                    >
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`font-bold text-sm ${msg.userId === currentUser?.id ? 'order-2' : ''}`}>
                          {msg.username}
                        </span>
                        <span className={`text-xs text-muted-foreground ${msg.userId === currentUser?.id ? 'order-1' : ''}`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          msg.userId === currentUser?.id
                            ? 'bg-primary text-primary-foreground glow-border'
                            : 'bg-background/50 border border-border'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message #${currentChannel}...`}
              className="flex-1 glow-border bg-background/50"
              maxLength={200}
            />
            <Button type="submit" disabled={!inputMessage.trim()} className="glow-border">
              <PaperPlaneRight size={16} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
