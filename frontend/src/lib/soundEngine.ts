type SoundEffect = 'navigate' | 'click' | 'success' | 'error' | 'notification'

class SoundEngine {
  private static instance: SoundEngine
  private isMuted: boolean = true

  private constructor() {}

  static getInstance(): SoundEngine {
    if (!SoundEngine.instance) {
      SoundEngine.instance = new SoundEngine()
    }
    return SoundEngine.instance
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted
  }

  isSoundMuted(): boolean {
    return this.isMuted
  }

  play(effect: SoundEffect): void {
    if (this.isMuted) return

    const frequencies: Record<SoundEffect, number> = {
      navigate: 440,
      click: 523.25,
      success: 659.25,
      error: 293.66,
      notification: 783.99,
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequencies[effect]
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.warn('Sound playback failed:', error)
    }
  }
}

export const soundEngine = SoundEngine.getInstance()
