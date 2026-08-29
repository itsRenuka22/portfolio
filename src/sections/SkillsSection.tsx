import { useEffect, useRef } from 'react'
import { motion, useMotionTemplate, useReducedMotion } from 'framer-motion'
import WaveHeading from '../components/WaveHeading'
import { SKILL_CATEGORIES } from '../data/skills'
import { useSectionParallax, useParallaxOffset } from '../hooks/useSectionParallax'

const AUTO_ADVANCE_MS = 3000
const RESUME_DELAY_MS = 3000
const TEXTURE_HORIZONTAL_RATE = 0.35

export default function SkillsSection() {
  const { sectionRef, progress } = useSectionParallax<HTMLElement>()
  const textureY = useParallaxOffset(progress, 16)
  const textureTransform = useMotionTemplate`translateY(${textureY}px)`
  const reduceMotion = useReducedMotion()
  const panelY = reduceMotion ? 0 : 48
  const panelScale = reduceMotion ? 1 : 0.88
  const textureRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const currentPanel = useRef(0)
  const autoAdvanceInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasInteracted = useRef(false)

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scrollToPanel = (index: number) => {
      const panel = panelRefs.current[0]
      if (!panel) return
      const panelWidth = panel.offsetWidth + 32
      slider.scrollTo({ left: index * panelWidth, behavior: 'smooth' })
    }

    const nextSlide = () => {
      currentPanel.current = (currentPanel.current + 1) % SKILL_CATEGORIES.length
      scrollToPanel(currentPanel.current)
    }

    const startAutoAdvance = () => {
      if (reduceMotion) return
      if (autoAdvanceInterval.current) clearInterval(autoAdvanceInterval.current)
      autoAdvanceInterval.current = setInterval(nextSlide, AUTO_ADVANCE_MS)
    }

    const stopAutoAdvance = () => {
      if (autoAdvanceInterval.current) clearInterval(autoAdvanceInterval.current)
    }

    const pause = () => {
      hasInteracted.current = true
      stopAutoAdvance()
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current)
    }

    const resume = () => {
      if (hasInteracted.current) return
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current)
      resumeTimeout.current = setTimeout(startAutoAdvance, RESUME_DELAY_MS)
    }

    const onScroll = () => {
      const panel = panelRefs.current[0]
      if (!panel) return
      const panelWidth = panel.offsetWidth + 32
      currentPanel.current = Math.round(slider.scrollLeft / panelWidth)
      if (textureRef.current && !reduceMotion) {
        textureRef.current.style.transform = `translateX(${-slider.scrollLeft * TEXTURE_HORIZONTAL_RATE}px)`
      }
    }

    slider.addEventListener('scroll', onScroll)
    slider.addEventListener('mouseenter', pause)
    slider.addEventListener('mouseleave', resume)
    slider.addEventListener('touchstart', pause)
    slider.addEventListener('touchend', resume)
    slider.addEventListener('focusin', pause)
    slider.addEventListener('focusout', resume)

    startAutoAdvance()

    return () => {
      stopAutoAdvance()
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current)
      slider.removeEventListener('scroll', onScroll)
      slider.removeEventListener('mouseenter', pause)
      slider.removeEventListener('mouseleave', resume)
      slider.removeEventListener('touchstart', pause)
      slider.removeEventListener('touchend', resume)
      slider.removeEventListener('focusin', pause)
      slider.removeEventListener('focusout', resume)
    }
  }, [])

  const manualNav = (dir: 1 | -1) => {
    hasInteracted.current = true
    if (autoAdvanceInterval.current) clearInterval(autoAdvanceInterval.current)
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current)
    currentPanel.current = (currentPanel.current + dir + SKILL_CATEGORIES.length) % SKILL_CATEGORIES.length
    const panel = panelRefs.current[0]
    if (!panel || !sliderRef.current) return
    const panelWidth = panel.offsetWidth + 32
    sliderRef.current.scrollTo({ left: currentPanel.current * panelWidth, behavior: 'smooth' })
  }

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="snap-start snap-always min-h-dvh w-full flex items-start relative overflow-y-auto pt-28 pb-16"
    >
      <motion.div className="absolute inset-0 overflow-hidden" style={{ transform: textureTransform }} aria-hidden="true">
        <div ref={textureRef} className="skills-parallax-texture" />
      </motion.div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full relative z-10">
        <motion.header
          initial={{ opacity: 0, y: reduceMotion ? 0 : 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 140, damping: 16 }}
          className="mb-12 relative pl-organic-offset"
        >
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-primary mb-4 relative z-10 cursor-default text-balance">
            <WaveHeading text="Technical" levels={[-10, -5]} />{' '}
            <span className="text-secondary">
              <WaveHeading text="Arsenal" levels={[-10, -5]} />
            </span>
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl text-pretty">
            Languages, frameworks, and tools I've used across coursework, work experience, and
            projects.
          </p>
          <div className="absolute -top-10 -left-4 w-32 h-32 bg-secondary-container rounded-full mix-blend-multiply opacity-50 blur-2xl -z-10" />
        </motion.header>

        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={() => manualNav(-1)}
            aria-label="Previous category"
            className="p-2 rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary active:scale-90 transition-[color,background-color,transform] shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            onClick={() => manualNav(1)}
            aria-label="Next category"
            className="p-2 rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary active:scale-90 transition-[color,background-color,transform] shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div ref={sliderRef} className="slider-container flex gap-8 pb-12 pt-8 px-4 -mx-4">
          {SKILL_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              ref={(el) => {
                panelRefs.current[i] = el
              }}
              tabIndex={0}
              initial={{ opacity: 0, y: panelY, scale: panelScale }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ type: 'spring', stiffness: 180, damping: 16 }}
              className="slider-panel wobble-card bg-surface p-6 shadow-[0_8px_32px_rgba(107,56,212,0.1)] h-80 flex flex-col transition-[transform,box-shadow] duration-300 ease-out hover:scale-105 focus:scale-105 hover:-translate-y-2 focus:-translate-y-2 hover:shadow-2xl focus:shadow-2xl hover:z-50 focus:z-50 active:scale-95 cursor-pointer outline-none"
            >
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="material-symbols-outlined text-primary text-[28px]"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  {cat.icon}
                </span>
                <h2 className="text-headline-md font-headline-md text-on-surface">{cat.name}</h2>
              </div>
              <div className="flex flex-wrap gap-3 overflow-y-auto">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-chip bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-label-bold font-label-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
