import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ActivityNode {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  type: 'hotspot' | 'cluster' | 'pulse'
  energy: number
  connections: string[]
}

export function BlockchainActivityMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<ActivityNode[]>([])
  const [stats, setStats] = useState({
    activeNodes: 0,
    transactions: 0,
    energy: 0,
  })
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.imageSmoothingEnabled = false

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const initialNodes: ActivityNode[] = Array.from({ length: 20 }, (_, i) => ({
      id: `node-${i}`,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      type: ['hotspot', 'cluster', 'pulse'][Math.floor(Math.random() * 3)] as ActivityNode['type'],
      energy: Math.random() * 100,
      connections: [],
    }))

    initialNodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < connectionCount; j++) {
        const targetIdx = Math.floor(Math.random() * initialNodes.length)
        if (targetIdx !== i) {
          node.connections.push(initialNodes[targetIdx].id)
        }
      }
    })

    setNodes(initialNodes)

    let frame = 0
    const animate = () => {
      frame++
      
      ctx.fillStyle = 'rgba(15, 15, 20, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      initialNodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        node.energy = (node.energy + 0.5) % 100

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))
      })

      ctx.strokeStyle = 'rgba(99, 220, 255, 0.1)'
      ctx.lineWidth = 1
      initialNodes.forEach((node) => {
        node.connections.forEach((targetId) => {
          const target = initialNodes.find((n) => n.id === targetId)
          if (target) {
            const distance = Math.hypot(target.x - node.x, target.y - node.y)
            if (distance < 200) {
              const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y)
              gradient.addColorStop(0, `rgba(99, 220, 255, ${0.3 * (1 - distance / 200)})`)
              gradient.addColorStop(1, `rgba(232, 150, 213, ${0.3 * (1 - distance / 200)})`)
              ctx.strokeStyle = gradient
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(target.x, target.y)
              ctx.stroke()

              if (frame % 60 === 0) {
                const midX = (node.x + target.x) / 2
                const midY = (node.y + target.y) / 2
                const pulseGradient = ctx.createRadialGradient(midX, midY, 0, midX, midY, 5)
                pulseGradient.addColorStop(0, 'rgba(99, 220, 255, 0.8)')
                pulseGradient.addColorStop(1, 'rgba(99, 220, 255, 0)')
                ctx.fillStyle = pulseGradient
                ctx.beginPath()
                ctx.arc(midX, midY, 5, 0, Math.PI * 2)
                ctx.fill()
              }
            }
          }
        })
      })

      initialNodes.forEach((node) => {
        const size = node.type === 'hotspot' ? 8 : node.type === 'cluster' ? 6 : 4
        const energyFactor = node.energy / 100
        
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 3)
        
        if (node.type === 'hotspot') {
          gradient.addColorStop(0, `rgba(232, 150, 213, ${0.8 * energyFactor})`)
          gradient.addColorStop(0.5, `rgba(232, 150, 213, ${0.3 * energyFactor})`)
          gradient.addColorStop(1, 'rgba(232, 150, 213, 0)')
        } else if (node.type === 'cluster') {
          gradient.addColorStop(0, `rgba(99, 220, 255, ${0.8 * energyFactor})`)
          gradient.addColorStop(0.5, `rgba(99, 220, 255, ${0.3 * energyFactor})`)
          gradient.addColorStop(1, 'rgba(99, 220, 255, 0)')
        } else {
          gradient.addColorStop(0, `rgba(255, 200, 100, ${0.8 * energyFactor})`)
          gradient.addColorStop(0.5, `rgba(255, 200, 100, ${0.3 * energyFactor})`)
          gradient.addColorStop(1, 'rgba(255, 200, 100, 0)')
        }
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = node.type === 'hotspot' 
          ? '#E896D5' 
          : node.type === 'cluster' 
          ? '#63DCFF' 
          : '#FFC864'
        ctx.beginPath()
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      if (frame % 30 === 0) {
        setStats({
          activeNodes: initialNodes.length,
          transactions: Math.floor(Math.random() * 10000) + 5000,
          energy: Math.floor(initialNodes.reduce((sum, n) => sum + n.energy, 0) / initialNodes.length),
        })
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <Card className="glow-border bg-card/50 backdrop-blur-sm overflow-hidden relative">
      <div className="p-4 border-b border-border/30">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-accent">◈</span>
          Blockchain Activity Map
        </h2>
        <div className="flex gap-4 mt-3">
          <Badge variant="outline" className="text-xs text-primary border-primary/30">
            Active Nodes: {stats.activeNodes}
          </Badge>
          <Badge variant="outline" className="text-xs text-chart-2 border-chart-2/30">
            Tx/s: {stats.transactions.toLocaleString()}
          </Badge>
          <Badge variant="outline" className="text-xs text-accent border-accent/30">
            Network Energy: {stats.energy}%
          </Badge>
        </div>
      </div>
      
      <div className="relative h-[400px] bg-background/30">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ imageRendering: 'crisp-edges' }}
        />
        
        <div className="absolute top-4 right-4 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(232,150,213,0.8)]" />
            <span className="text-muted-foreground">Hotspots</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(99,220,255,0.8)]" />
            <span className="text-muted-foreground">Clusters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-4 shadow-[0_0_10px_rgba(255,200,100,0.8)]" />
            <span className="text-muted-foreground">Pulses</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
