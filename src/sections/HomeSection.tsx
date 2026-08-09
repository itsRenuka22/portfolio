import { useEffect, useRef } from 'react'
import WavyText from '../components/WavyText'
import headshot from '../assets/headshot.jpg'

const TOTAL_PROJECT_COUNT = 10

const STATS = [
  { value: '3.96', label: 'BE CGPA / 4.0' },
  { value: '3.56', label: 'MS CGPA / 4.0' },
  { value: '3', label: 'Publications' },
  { value: String(TOTAL_PROJECT_COUNT), label: 'Projects' },
]

const EDUCATION = [
  {
    degree: 'MS Software Engineering',
    school: 'San Jose State University',
    dates: 'Aug 2025 – May 2027',
    coursework: 'Software Systems Engineering, Enterprise Software Platforms, Machine Learning',
  },
  {
    degree: 'BE Computer Engineering',
    school: 'University of Mumbai',
    dates: 'Aug 2020 – May 2024 · CGPA 3.96/4.0',
    coursework: 'Data Structures, Analysis of Algorithms, Operating Systems, NLP, Artificial Intelligence',
  },
]

export default function HomeSection() {
  const heroRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const blobContainerRef = useRef<HTMLDivElement>(null)
  const blobImageRef = useRef<HTMLDivElement>(null)
  const blobShadowRef = useRef<HTMLDivElement>(null)

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

  return (
    <section
      id="home"
      ref={heroRef}
      className="hero-section snap-start snap-always h-screen w-full flex items-center overflow-y-auto"
    >
      <div ref={glowRef} className="hero-glow" />
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center pt-24">
        <div className="md:col-span-7 flex flex-col gap-6 z-10 relative">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface cursor-default">
            <WavyText text="Renuka Prasad Patwari" className="wavy-text" />
          </h1>
          <h2 className="font-headline-md text-headline-md text-primary relative z-10 cursor-default">
            <WavyText text="Systems Architect & AI Engineer" className="wavy-title" />
          </h2>
          <div className="highlight-text-container cursor-default">
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl relative z-10">
              I build scalable intelligence into everyday systems. From optimizing neural networks to
              designing robust microservices, I bridge the gap between theoretical AI and production-ready
              applications.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 relative z-10">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-bold text-label-bold btn-pop transition-all"
            >
              View Projects
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-surface-container-lowest text-primary border-2 border-primary px-8 py-4 rounded-full font-label-bold text-label-bold hover:scale-105 transition-transform duration-200 shadow-violet-hard"
            >
              Get in Touch
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t-2 border-secondary-container/30 relative z-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1 stat-block cursor-default">
                <span className="font-headline-sm text-headline-sm text-primary stat-num">{stat.value}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-6 relative z-10">
            {EDUCATION.map((edu) => (
              <div
                key={edu.degree}
                className="bg-surface-container-lowest px-5 py-4 card-mint-border shadow-violet-float"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-label-bold text-label-bold text-primary">{edu.degree}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{edu.dates}</p>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">{edu.school}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{edu.coursework}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={blobContainerRef}
          className="md:col-span-5 relative mt-12 md:mt-0 flex justify-center md:justify-end"
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
            MS Software Engineering
          </div>
        </div>
      </div>
    </section>
  )
}
