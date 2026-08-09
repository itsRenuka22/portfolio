interface WavyTextProps {
  text: string
  className?: string
}

export default function WavyText({ text, className = 'wavy-text' }: WavyTextProps) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <span key={i}>{char === ' ' ? ' ' : char}</span>
      ))}
    </span>
  )
}
