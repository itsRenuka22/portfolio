import { Fragment, useRef } from 'react'

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

  // Letters are indexed continuously across the whole string (spaces consume an
  // index slot too) so the hover falloff distance matches the original flat
  // per-character layout. Each word's letters are grouped in their own
  // `whitespace-nowrap` box so the browser can only wrap at real word
  // boundaries, not between individual letter spans.
  const words = text.split(' ')
  let nextIndex = 0

  return (
    <span ref={wrapperRef} className={className}>
      {words.map((word, wi) => {
        const isLastWord = wi === words.length - 1
        const letters = word.split('').map((char, i) => {
          const index = nextIndex++
          return (
            <span
              key={i}
              data-index={index}
              className="inline-block transition-transform duration-200 ease-out"
              onMouseEnter={() => handleEnter(index)}
              onMouseLeave={handleLeave}
            >
              {char}
            </span>
          )
        })
        if (!isLastWord) nextIndex++ // reserve the space's index slot
        return (
          <Fragment key={wi}>
            <span className="inline-block whitespace-nowrap">{letters}</span>
            {!isLastWord ? ' ' : null}
          </Fragment>
        )
      })}
    </span>
  )
}
