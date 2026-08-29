import { Fragment } from 'react'

interface WavyTextProps {
  text: string
  className?: string
}

export default function WavyText({ text, className = 'wavy-text' }: WavyTextProps) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.split('').map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}
