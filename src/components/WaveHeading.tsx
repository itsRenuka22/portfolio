import { useRef } from 'react'

interface WaveHeadingProps {
  text: string
  className?: string
  /** translateY (px) indexed by letter distance from the hovered letter; index 0 = the hovered letter itself */
  levels?: number[]
}

const DEFAULT_LEVELS = [-8, -4, -1.5]

export default function WaveHeading({ text, className = '', levels = DEFAULT_LEVELS }: WaveHeadingProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null)

  const handleEnter = (index: number) => {
    const spans = wrapperRef.current?.querySelectorAll('span[data-index]')
    spans?.forEach((el) => {
      const span = el as HTMLElement
      const i = Number(span.dataset.index)
      const distance = Math.abs(index - i)
      const translateY = levels[distance] ?? 0
      span.style.transform = `translateY(${translateY}px)`
    })
  }

  const handleLeave = () => {
    const spans = wrapperRef.current?.querySelectorAll('span[data-index]')
    spans?.forEach((el) => {
      ;(el as HTMLElement).style.transform = 'translateY(0)'
    })
  }

  return (
    <span ref={wrapperRef} className={className}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          data-index={i}
          className="inline-block transition-transform duration-200 ease-out"
          onMouseEnter={() => handleEnter(i)}
          onMouseLeave={handleLeave}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}
