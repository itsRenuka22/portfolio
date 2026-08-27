import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionTemplate } from 'framer-motion'
import WavyText from '../components/WavyText'
import WaveHeading from '../components/WaveHeading'
import headshot from '../assets/headshot.jpg'
import { useSectionParallax, useParallaxOffset } from '../hooks/useSectionParallax'

const EDUCATION = [
  {
    degree: 'MS Software Engineering',
    school: 'San Jose State University',
    dates: 'Aug 2025 – May 2027',
    detail: 'CGPA 3.62/4.0',
  },
  {
    degree: 'BE Computer Engineering',
    school: 'University of Mumbai',
    dates: 'Aug 2020 – May 2024',
    detail: 'CGPA 3.96/4.0',
  },
]

const ABOUT_PARAGRAPHS: ReactNode[] = [
  "System breaker turned builder. I've redesigned a choking fraud pipeline using Kafka, re-architected broken security scanning logic, and led AI initiatives representing SJSU." ,
  <>
    <strong>Winner of the President's Leadership Coin</strong>, an honor given to a select few for university-wide leadership and service.
  </>,
]

export default function HomeSection() {
  const { sectionRef: parallaxRef, progress } = useSectionParallax<HTMLElement>()
  const blobAY = useParallaxOffset(progress, -60)
  const blobBY = useParallaxOffset(progress, 80)
  const textY = useParallaxOffset(progress, 24)
  const photoY = useParallaxOffset(progress, 44)
  const blobATransform = useMotionTemplate`translateY(${blobAY}px)`
  const blobBTransform = useMotionTemplate`translateY(${blobBY}px)`
  const textTransform = useMotionTemplate`translateY(${textY}px)`
  const photoTransform = useMotionTemplate`translateY(${photoY}px)`

  const heroRef = useRef<HTMLElement>(null)
  const setHeroRefs = (el: HTMLElement | null) => {
    heroRef.current = el
    parallaxRef.current = el
  }
  const glowRef = useRef<HTMLDivElement>(null)
  const blobContainerRef = useRef<HTMLDivElement>(null)
  const blobImageRef = useRef<HTMLDivElement>(null)
  const blobShadowRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const lineHighlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let raf = 0

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 12
      targetY = (e.clientY / window.innerHeight - 0.5) * 12
    }
    document.addEventListener('mousemove', onMouseMove)

    const animateBlob = () => {
      currentX += (targetX - currentX) * 0.04
      currentY += (targetY - currentY) * 0.04
      if (blobImageRef.current) {
        blobImageRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`
      }
      if (blobShadowRef.current) {
        blobShadowRef.current.style.transform = `translate(${currentX * 0.5 + 16}px, ${currentY * 0.5 + 16}px)`
      }
      raf = requestAnimationFrame(animateBlob)
    }
    raf = requestAnimationFrame(animateBlob)

    const heroEl = heroRef.current
    let glowRafId = 0
    let pendingGlowX = 0
    let pendingGlowY = 0
    const applyGlowPosition = () => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pendingGlowX - 200}px, ${pendingGlowY - 200}px)`
      }
    }
    const onHeroMouseMove = (e: MouseEvent) => {
      if (!heroEl) return
      const rect = heroEl.getBoundingClientRect()
      pendingGlowX = e.clientX - rect.left
      pendingGlowY = e.clientY - rect.top
      cancelAnimationFrame(glowRafId)
      glowRafId = requestAnimationFrame(applyGlowPosition)
    }
    heroEl?.addEventListener('mousemove', onHeroMouseMove)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      heroEl?.removeEventListener('mousemove', onHeroMouseMove)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(glowRafId)
    }
  }, [])

  useEffect(() => {
    const container = aboutRef.current
    const highlight = lineHighlightRef.current
    if (!container || !highlight) return

    const getCaretRange = (x: number, y: number): Range | null => {
      if (document.caretRangeFromPoint) {
        return document.caretRangeFromPoint(x, y)
      }
      const withCaretPosition = document as Document & {
        caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null
      }
      const pos = withCaretPosition.caretPositionFromPoint?.(x, y)
      if (!pos) return null
      const range = document.createRange()
      range.setStart(pos.offsetNode, pos.offset)
      range.collapse(true)
      return range
    }

    let currentLineKey = ''
    let pendingHighlightRaf = 0

    const applyHighlight = (top: number, left: number, width: number, height: number, isNewLine: boolean) => {
      highlight.style.opacity = '1'
      if (isNewLine) {
        highlight.style.transition = 'none'
        highlight.style.transform = `translate(${left}px, ${top}px) scaleX(0) scaleY(${height})`
        // Force reflow so the next transform change animates.
        void highlight.offsetWidth
        highlight.style.transition = ''
      }
      highlight.style.transform = `translate(${left}px, ${top}px) scaleX(${width}) scaleY(${height})`
    }

    const onMouseMove = (e: MouseEvent) => {
      const caret = getCaretRange(e.clientX, e.clientY)
      const textNode = caret?.startContainer
      if (!caret || !textNode || !container.contains(textNode) || textNode.nodeType !== Node.TEXT_NODE) {
        highlight.style.opacity = '0'
        currentLineKey = ''
        return
      }

      const text = textNode.textContent ?? ''
      const paragraphEl = textNode.parentElement?.closest('p') ?? textNode.parentElement
      const lineRange = document.createRange()
      lineRange.selectNodeContents(paragraphEl ?? textNode)
      const fullRects = Array.from(lineRange.getClientRects()).filter((r) => r.width > 0)

      if (fullRects.length === 0 || text.trim().length === 0) {
        highlight.style.opacity = '0'
        currentLineKey = ''
        return
      }

      // Pick the nearest line by vertical distance rather than requiring exact
      // containment — e.clientY is reported as an integer while getClientRects()
      // returns fractional bounds, so a strict top/bottom check can miss by a
      // sub-pixel gap right at a line boundary.
      const verticalDistance = (r: DOMRect) =>
        e.clientY < r.top ? r.top - e.clientY : e.clientY > r.bottom ? e.clientY - r.bottom : 0
      const hitRect = fullRects.reduce((closest, r) =>
        verticalDistance(r) < verticalDistance(closest) ? r : closest,
      )

      // Merge every rect on the same visual line (e.g. split by an inline <strong>)
      // into one bounding box so the highlight covers the full line, not just one run.
      const sameLineRects = fullRects.filter(
        (r) => r.width > 0 && Math.abs(r.top - hitRect.top) < 1 && Math.abs(r.bottom - hitRect.bottom) < 1,
      )
      const bounds = sameLineRects.reduce(
        (acc, r) => ({
          top: Math.min(acc.top, r.top),
          bottom: Math.max(acc.bottom, r.bottom),
          left: Math.min(acc.left, r.left),
          right: Math.max(acc.right, r.right),
        }),
        { top: hitRect.top, bottom: hitRect.bottom, left: hitRect.left, right: hitRect.right },
      )
      const lineRect = { ...bounds, width: bounds.right - bounds.left, height: bounds.bottom - bounds.top }

      const containerRect = container.getBoundingClientRect()
      const top = lineRect.top - containerRect.top
      const left = lineRect.left - containerRect.left
      const lineKey = `${top}:${left}:${lineRect.width}`
      const isNewLine = lineKey !== currentLineKey
      if (isNewLine) currentLineKey = lineKey

      cancelAnimationFrame(pendingHighlightRaf)
      pendingHighlightRaf = requestAnimationFrame(() => {
        applyHighlight(top, left, lineRect.width, lineRect.height, isNewLine)
      })
    }

    const onMouseLeave = () => {
      currentLineKey = ''
      cancelAnimationFrame(pendingHighlightRaf)
      highlight.style.opacity = '0'
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(pendingHighlightRaf)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <section
      id="home"
      ref={setHeroRefs}
      className="hero-section snap-start snap-always h-screen w-full flex items-center overflow-y-auto"
    >
      <motion.div
        className="hero-parallax-blob hero-parallax-blob-a"
        style={{ transform: blobATransform }}
        aria-hidden="true"
      />
      <motion.div
        className="hero-parallax-blob hero-parallax-blob-b"
        style={{ transform: blobBTransform }}
        aria-hidden="true"
      />
      <div ref={glowRef} className="hero-glow" />
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center pt-20">
        <motion.div className="md:col-span-7 flex flex-col gap-3 z-10 relative" style={{ transform: textTransform }}>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface cursor-default leading-tight text-balance">
            <WavyText text="Renuka Prasad Patwari" className="wavy-text" />
          </h1>
          <h2 className="font-headline-md text-headline-md text-primary relative z-10 cursor-default text-balance">
            <WavyText text="Software Engineer & AI Systems Builder" className="wavy-title" />
          </h2>
          <div ref={aboutRef} className="cursor-default flex flex-col gap-1.5 relative z-10 max-w-2xl">
            <div ref={lineHighlightRef} className="marker-line-highlight" />
            {ABOUT_PARAGRAPHS.map((paragraph, i) => (
              <p key={i} className="font-body-md text-body-md text-on-surface-variant leading-snug text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-1 relative z-10">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-bold text-label-bold btn-pop transition-[transform,box-shadow] active:scale-[0.97]"
            >
              View Projects
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-surface-container-lowest text-primary border-2 border-primary px-6 py-2.5 rounded-full font-label-bold text-label-bold hover:scale-105 active:scale-[0.97] transition-transform duration-200 shadow-violet-hard"
            >
              Get in Touch
            </button>
          </div>

          <div className="mt-5 pt-5 border-t-2 border-secondary-container/30 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-[28px]">school</span>
              <h3 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary relative inline-block cursor-default tracking-normal">
                <WaveHeading text="Education" />
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary-container/10 border border-secondary-container/30 rounded-3xl p-4">
              {EDUCATION.map((edu) => (
                <div
                  key={edu.degree}
                  className="experience-card bg-surface-container-lowest px-4 py-3 card-mint-border cursor-default flex flex-col"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="shrink-0 bg-primary/15 border border-primary/30 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm whitespace-nowrap">
                      {edu.dates}
                    </span>
                    <span className="shrink-0 bg-primary text-on-primary px-3 py-1 rounded-full font-label-bold text-label-sm whitespace-nowrap">
                      {edu.detail}
                    </span>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-primary leading-tight">{edu.degree}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">{edu.school}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={blobContainerRef}
          className="md:col-span-5 relative mt-6 md:mt-0 md:-translate-y-8 flex justify-center md:justify-end"
          style={{ transform: photoTransform }}
        >
          <div
            ref={blobShadowRef}
            className="absolute inset-0 bg-secondary-container organic-shape blur-xl opacity-50 transform translate-x-4 translate-y-4"
          />
          <div
            ref={blobImageRef}
            className="w-64 h-64 md:w-96 md:h-96 relative z-10 organic-shape overflow-hidden border-4 border-surface-container-lowest shadow-violet-float"
          >
            <img src={headshot} alt="Renuka Prasad Patwari" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
