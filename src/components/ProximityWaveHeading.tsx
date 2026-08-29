import { Fragment, useEffect, useRef } from 'react'

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
    let letterCenters: number[] = []

    const measure = () => {
      letterCenters = letters.map((letter) => {
        const rect = letter.getBoundingClientRect()
        return rect.left + rect.width / 2
      })
    }
    measure()

    let pendingX: number | null = null
    let rafId = 0

    const applyLift = () => {
      if (pendingX === null) return
      const mouseX = pendingX
      letters.forEach((letter, i) => {
        const distance = Math.abs(mouseX - letterCenters[i])
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

    const onMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(applyLift)
    }

    const onMouseLeave = () => {
      pendingX = null
      cancelAnimationFrame(rafId)
      letters.forEach((letter) => {
        letter.style.transform = 'translateY(0px)'
      })
    }

    const onResize = () => measure()

    heading.addEventListener('mousemove', onMouseMove)
    heading.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', onResize)
    return () => {
      heading.removeEventListener('mousemove', onMouseMove)
      heading.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Each word's letters are grouped in a `whitespace-nowrap` box so the browser
  // can only wrap at real word boundaries, not between individual letter spans.
  const words = text.split(' ')

  return (
    <h1 ref={headingRef} className={className}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.split('').map((char, i) => (
              <span key={i} className="wave-letter">
                {char}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? <span className="wave-letter">&nbsp;</span> : null}
        </Fragment>
      ))}
    </h1>
  )
}
