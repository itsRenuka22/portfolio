import { useEffect, useRef } from 'react'

interface ProximityWaveHeadingProps {
  text: string
  className?: string
}

export default function ProximityWaveHeading({ text, className = '' }: ProximityWaveHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const heading = headingRef.current
    if (!heading || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const letters = Array.from(heading.querySelectorAll<HTMLElement>('.wave-letter'))

    const onMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect()
        const letterCenterX = rect.left + rect.width / 2
        const distance = Math.abs(mouseX - letterCenterX)
        const maxDistance = 150
        const maxLift = -15

        if (distance < maxDistance) {
          const normalizedDist = distance / maxDistance
          const liftFactor = (Math.cos(normalizedDist * Math.PI) + 1) / 2
          letter.style.transform = `translateY(${maxLift * liftFactor}px)`
        } else {
          letter.style.transform = 'translateY(0px)'
        }
      })
    }

    const onMouseLeave = () => {
      letters.forEach((letter) => {
        letter.style.transform = 'translateY(0px)'
      })
    }

    heading.addEventListener('mousemove', onMouseMove)
    heading.addEventListener('mouseleave', onMouseLeave)
    return () => {
      heading.removeEventListener('mousemove', onMouseMove)
      heading.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <h1 ref={headingRef} className={className}>
      {text.split('').map((char, i) => (
        <span key={i} className="wave-letter">
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </h1>
  )
}
