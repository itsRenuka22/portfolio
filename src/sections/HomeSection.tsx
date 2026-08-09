import { useEffect, useRef } from 'react'
import WavyText from '../components/WavyText'
import headshot from '../assets/headshot.jpg'

const TOTAL_PROJECT_COUNT = 10

const STATS = [
  { value: '3.62', label: 'MS CGPA / 4.0' },
  { value: '3', label: 'Publications' },
  { value: '6', label: 'Hackathons' },
  { value: String(TOTAL_PROJECT_COUNT), label: 'Projects' },
]

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

const ABOUT_LINES = [
  'I learn backend systems by breaking them.',
  'Rebuilt a fraud pipeline on Kafka after it choked.',
  'Fixed a security scanner that flagged everything.',
  'I also like a ticking clock. Six hackathons, two wins, most just hours long.',
  "None of it's on a transcript, but it's where the real learning happens.",
]

export default function HomeSection() {
  const heroRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const blobContainerRef = useRef<HTMLDivElement>(null)
  const blobImageRef = useRef<HTMLDivElement>(null)
  const blobShadowRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)

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
    const onHeroMouseMove = (e: MouseEvent) => {
      if (!heroEl || !glowRef.current) return
      const rect = heroEl.getBoundingClientRect()
      glowRef.current.style.left = `${e.clientX - rect.left}px`
      glowRef.current.style.top = `${e.clientY - rect.top}px`
    }
    heroEl?.addEventListener('mousemove', onHeroMouseMove)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      heroEl?.removeEventListener('mousemove', onHeroMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const container = aboutRef.current
    if (!container) return

    const lines = container.querySelectorAll<HTMLElement>('.marker-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          lines.forEach((line, i) => {
            setTimeout(() => line.classList.add('is-revealed'), i * 220)
          })
          observer.disconnect()
        })
      },
      { threshold: 0.4 },
    )
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="home"
      ref={heroRef}
      className="hero-section snap-start snap-always h-screen w-full flex items-center overflow-y-auto"
    >
      <div ref={glowRef} className="hero-glow" />
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center pt-20">
        <div className="md:col-span-7 flex flex-col gap-3 z-10 relative">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface cursor-default leading-tight">
            <WavyText text="Renuka Prasad Patwari" className="wavy-text" />
          </h1>
          <h2 className="font-headline-md text-headline-md text-primary relative z-10 cursor-default">
            <WavyText text="Software Engineer & AI Systems Builder" className="wavy-title" />
          </h2>
          <div
            ref={aboutRef}
            className="cursor-default flex flex-col gap-1.5 relative z-10 max-w-2xl"
          >
            {ABOUT_LINES.map((line, i) => (
              <p key={i} className="font-body-md text-body-md text-on-surface-variant leading-snug">
                <span className="marker-reveal">{line}</span>
              </p>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-1 relative z-10">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-bold text-label-bold btn-pop transition-all"
            >
              View Projects
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-surface-container-lowest text-primary border-2 border-primary px-6 py-2.5 rounded-full font-label-bold text-label-bold hover:scale-105 transition-transform duration-200 shadow-violet-hard"
            >
              Get in Touch
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t-2 border-secondary-container/30 relative z-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5 stat-block cursor-default">
                <span className="font-headline-sm text-headline-sm text-primary stat-num">{stat.value}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t-2 border-secondary-container/30 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-[20px]">school</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface relative inline-block">
                Education
                <span className="absolute -bottom-1 left-0 w-10 h-1 rounded-full bg-primary" />
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-secondary-container/10 border border-secondary-container/30 rounded-3xl p-3">
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
        </div>

        <div
          ref={blobContainerRef}
          className="md:col-span-5 relative mt-6 md:mt-0 md:-translate-y-8 flex justify-center md:justify-end"
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
          <div className="absolute -bottom-4 right-10 md:-left-4 md:bottom-10 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-4 py-2 rounded-full font-label-bold text-label-bold shadow-[0_4px_12px_rgba(107,56,212,0.2)] animate-float z-20">
            Ready for the next challenge you throw at me
          </div>
        </div>
      </div>
    </section>
  )
}
