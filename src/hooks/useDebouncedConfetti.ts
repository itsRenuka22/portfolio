import { useRef } from 'react'
import confetti from 'canvas-confetti'

const COOLDOWN_MS = 1500

export function useDebouncedConfetti() {
  const cardRef = useRef<HTMLDivElement>(null)
  const readyRef = useRef(true)

  const fire = () => {
    if (!readyRef.current) return
    readyRef.current = false

    const el = cardRef.current
    const origin = el
      ? (() => {
          const rect = el.getBoundingClientRect()
          return {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          }
        })()
      : { x: 0.5, y: 0.5 }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti({
        particleCount: 80,
        spread: 70,
        startVelocity: 35,
        origin,
        colors: ['#6b38d4', '#a6f2cf', '#ffe24c', '#8455ef'],
        zIndex: 100,
      })
    }

    setTimeout(() => {
      readyRef.current = true
    }, COOLDOWN_MS)
  }

  return { cardRef, onHoverStart: fire }
}
