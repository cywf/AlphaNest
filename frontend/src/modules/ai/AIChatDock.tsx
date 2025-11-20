import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  X,
  PaperPlaneRight,
  Storefront,
  ChartLine,
  Shield,
  Detective,
  Robot,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: number
}

interface AIChatDockProps {
  isOpen: boolean
  onClose: () => void
  contextType?: 'market' | 'arbitrage' | 'clan' | 'wallet' | null
}

export function AIChatDock({ isOpen, onClose, contextType = null }: AIChatDockProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant for AlphaNest. I can help you with market analysis, arbitrage opportunities, clan strategies, and wallet risk assessment. What would you like to know?',
      timestamp: Date.now(),
    },
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        type: 'ai',
        content: 'AI response will be generated here once the backend is connected. This is a placeholder for the AI chat functionality.',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const handleAttachContext = (type: string) => {
    const contextMessage: Message = {
      id: `msg_${Date.now()}_context`,
      type: 'user',
      content: `[Attached ${type} context]`,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, contextMessage])
  }

  return (
    <div
      className={cn(
        'fixed top-[65px] right-0 bottom-0 w-96 bg-card/95 backdrop-blur-md border-l border-primary/30 z-50 transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Robot size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">AlphaNest Intelligence</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          {contextType && (
            <Badge variant="outline" className="text-xs">
              Context: {contextType}
            </Badge>
          )}
        </div>

        <div className="p-4 border-b border-primary/20">
          <p className="text-xs text-muted-foreground mb-2">QUICK ACTIONS</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="justify-start text-xs"
              onClick={() => handleAttachContext('Market')}
            >
              <Storefront size={14} className="mr-1" />
              Market
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start text-xs"
              onClick={() => handleAttachContext('Arbitrage')}
            >
              <ChartLine size={14} className="mr-1" />
              Arbitrage
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start text-xs"
              onClick={() => handleAttachContext('Clan')}
            >
              <Shield size={14} className="mr-1" />
              Clan
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start text-xs"
              onClick={() => handleAttachContext('Wallet')}
            >
              <Detective size={14} className="mr-1" />
              Wallet
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] p-3 rounded-lg text-sm',
                    message.type === 'user'
                      ? 'bg-primary/20 text-foreground'
                      : 'bg-muted/50 text-foreground'
                  )}
                >
                  {message.content}
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-primary/20">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} size="icon" className="shrink-0">
              <PaperPlaneRight size={18} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI features coming soon
          </p>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-50" />
    </div>
  )
}
