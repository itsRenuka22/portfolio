import { useEffect, useRef } from 'react'
import WaveHeading from '../components/WaveHeading'
import { SKILL_CATEGORIES } from '../data/skills'

const AUTO_ADVANCE_MS = 3000
const RESUME_DELAY_MS = 3000

export default function SkillsSection() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const currentPanel = useRef(0)
  const autoAdvanceInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

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
      stopAutoAdvance()
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current)
    }

    const resume = () => {
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current)
      resumeTimeout.current = setTimeout(startAutoAdvance, RESUME_DELAY_MS)
    }

    const onScroll = () => {
      const panel = panelRefs.current[0]
      if (!panel) return
      const panelWidth = panel.offsetWidth + 32
      currentPanel.current = Math.round(slider.scrollLeft / panelWidth)
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
    currentPanel.current = (currentPanel.current + dir + SKILL_CATEGORIES.length) % SKILL_CATEGORIES.length
    const panel = panelRefs.current[0]
    if (!panel || !sliderRef.current) return
    const panelWidth = panel.offsetWidth + 32
    sliderRef.current.scrollTo({ left: currentPanel.current * panelWidth, behavior: 'smooth' })
  }

  return (
    <section
      id="skills"
      className="snap-start snap-always h-screen w-full flex items-start relative overflow-y-auto pt-28 pb-16"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <header className="mb-12 relative pl-organic-offset">
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-primary mb-4 relative z-10 cursor-default">
            <WaveHeading text="Technical" levels={[-10, -5]} />{' '}
            <span className="text-secondary">
              <WaveHeading text="Arsenal" levels={[-10, -5]} />
            </span>
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
            A curated collection of tools, languages, and frameworks — building momentum through
            continuous learning and practical application.
          </p>
          <div className="absolute -top-10 -left-4 w-32 h-32 bg-secondary-container rounded-full mix-blend-multiply opacity-50 blur-2xl -z-10" />
        </header>

        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={() => manualNav(-1)}
            aria-label="Previous category"
            className="p-2 rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            onClick={() => manualNav(1)}
            aria-label="Next category"
            className="p-2 rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div ref={sliderRef} className="slider-container flex gap-8 pb-12 pt-8 px-4 -mx-4">
          {SKILL_CATEGORIES.map((cat, i) => (
            <div
              key={cat.name}
              ref={(el) => {
                panelRefs.current[i] = el
              }}
              tabIndex={0}
              className="slider-panel wobble-card bg-surface p-6 shadow-[0_8px_32px_rgba(107,56,212,0.1)] h-80 flex flex-col transition-all duration-300 ease-out hover:scale-105 focus:scale-105 hover:-translate-y-2 focus:-translate-y-2 hover:shadow-2xl focus:shadow-2xl hover:z-50 focus:z-50 active:scale-95 cursor-pointer outline-none"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
