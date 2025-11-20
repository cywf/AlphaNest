import { useRef, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Cube, ArrowsClockwise } from '@phosphor-icons/react'
import * as THREE from 'three'
import type { NewCoin } from './types'

interface CoinMetricsVisualizerProps {
  coin: NewCoin
  onClose: () => void
}

export function CoinMetricsVisualizer({ coin, onClose }: CoinMetricsVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRotating, setIsRotating] = useState(true)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    objects: THREE.Object3D[]
    animationId: number | null
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0f)
    
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    const centerGeometry = new THREE.IcosahedronGeometry(1, 1)
    const centerMaterial = new THREE.MeshPhongMaterial({
      color: 0x63dcff,
      emissive: 0x63dcff,
      emissiveIntensity: 0.5,
      shininess: 100,
      wireframe: false,
    })
    const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial)
    scene.add(centerMesh)

    const ambientLight = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x63dcff, 2, 10)
    pointLight1.position.set(3, 3, 3)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xe896d5, 2, 10)
    pointLight2.position.set(-3, -3, -3)
    scene.add(pointLight2)

    const metricSpheres: THREE.Mesh[] = []
    const metrics = [
      { label: 'Sentiment', value: coin.sentimentScore, color: 0x63dcff, angle: 0 },
      { label: 'Hype', value: coin.hypeLevel === 'viral' ? 100 : coin.hypeLevel === 'trending' ? 75 : coin.hypeLevel === 'growing' ? 50 : 25, color: 0xe896d5, angle: Math.PI * 2 / 5 },
      { label: 'Risk', value: coin.riskLevel === 'extreme' ? 100 : coin.riskLevel === 'high' ? 75 : coin.riskLevel === 'medium' ? 50 : 25, color: 0xffc864, angle: Math.PI * 4 / 5 },
      { label: 'Days', value: Math.max(0, coin.daysUntilLaunch), color: 0x63dcff, angle: Math.PI * 6 / 5 },
      { label: 'Cap', value: coin.marketCap || 0, color: 0xe896d5, angle: Math.PI * 8 / 5 },
    ]

    metrics.forEach((metric) => {
      const geometry = new THREE.SphereGeometry(0.15, 16, 16)
      const material = new THREE.MeshPhongMaterial({
        color: metric.color,
        emissive: metric.color,
        emissiveIntensity: 0.6,
      })
      const sphere = new THREE.Mesh(geometry, material)
      
      const radius = 2.5
      sphere.position.x = Math.cos(metric.angle) * radius
      sphere.position.y = Math.sin(metric.angle) * radius
      sphere.position.z = 0
      
      scene.add(sphere)
      metricSpheres.push(sphere)

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(sphere.position.x, sphere.position.y, sphere.position.z),
      ])
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: metric.color, 
        transparent: true, 
        opacity: 0.3 
      })
      const line = new THREE.Line(lineGeometry, lineMaterial)
      scene.add(line)
    })

    const ringGeometry = new THREE.TorusGeometry(2.5, 0.02, 16, 100)
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x63dcff, 
      transparent: true, 
      opacity: 0.2 
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    scene.add(ring)

    let animationId: number | null = null
    const objects = [centerMesh, ring, ...metricSpheres]

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (isRotating) {
        centerMesh.rotation.x += 0.005
        centerMesh.rotation.y += 0.01
        
        ring.rotation.z += 0.002

        metricSpheres.forEach((sphere, index) => {
          const time = Date.now() * 0.001
          const angle = metrics[index].angle + time * 0.3
          const radius = 2.5
          sphere.position.x = Math.cos(angle) * radius
          sphere.position.y = Math.sin(angle) * radius
          sphere.position.z = Math.sin(time + index) * 0.3
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    sceneRef.current = { scene, camera, renderer, objects, animationId }

    const handleResize = () => {
      if (containerRef.current) {
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [coin, isRotating])

  const metrics = [
    { label: 'Sentiment Score', value: `${coin.sentimentScore}/100`, color: 'text-primary' },
    { label: 'Hype Level', value: coin.hypeLevel.toUpperCase(), color: 'text-accent' },
    { label: 'Risk Level', value: coin.riskLevel.toUpperCase(), color: 'text-chart-4' },
    { label: 'Days Until Launch', value: Math.max(0, coin.daysUntilLaunch).toString(), color: 'text-primary' },
    { label: 'Market Cap', value: coin.marketCap ? `$${coin.marketCap.toLocaleString()}` : 'TBD', color: 'text-accent' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="glow-border bg-card/95 w-full max-w-5xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cube className="h-8 w-8 text-primary" weight="duotone" />
            <div>
              <h2 className="text-2xl font-bold">{coin.symbol}</h2>
              <p className="text-sm text-muted-foreground">{coin.coinName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRotating(!isRotating)}
            >
              <ArrowsClockwise className="h-4 w-4 mr-2" />
              {isRotating ? 'Pause' : 'Rotate'}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2">
            <div 
              ref={containerRef} 
              className="w-full h-[500px] rounded-lg border border-border/30 bg-background/30 overflow-hidden"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="text-accent">◈</span>
                Live Metrics
              </h3>
              <div className="space-y-3">
                {metrics.map((metric, index) => (
                  <div key={index} className="p-3 bg-background/50 rounded-lg border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                    <p className={`text-lg font-bold font-mono ${metric.color}`}>
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border/30">
              <h3 className="text-sm font-bold mb-2">Risk Assessment</h3>
              <Badge variant="outline" className={`text-${coin.riskLevel === 'low' ? 'green' : coin.riskLevel === 'medium' ? 'yellow' : 'red'}-400`}>
                {coin.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>

            <div className="pt-4 border-t border-border/30">
              <h3 className="text-sm font-bold mb-2">Sentiment Score</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{coin.sentimentScore}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-background/30">
          <p className="text-xs text-muted-foreground text-center">
            ⚡ 3D holographic visualization powered by Three.js
          </p>
        </div>
      </Card>
    </div>
  )
}
