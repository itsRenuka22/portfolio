import { motion, useMotionTemplate, useReducedMotion } from 'framer-motion'
import WaveHeading from '../components/WaveHeading'
import { EXPERIENCE, type ExperienceEntry } from '../data/experience'
import { useSectionParallax, useParallaxOffset } from '../hooks/useSectionParallax'

function ExperienceCard({ job, index }: { job: ExperienceEntry; index: number }) {
  const { sectionRef, progress } = useSectionParallax<HTMLDivElement>()
  const contentY = useParallaxOffset(progress, 18)
  const contentTransform = useMotionTemplate`translateY(${contentY}px)`
  const reduceMotion = useReducedMotion()
  const cardY = reduceMotion ? 0 : 56
  const cardScale = reduceMotion ? 1 : 0.94

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: cardY, scale: cardScale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 160, damping: 17, delay: index * 0.12 }}
      style={{ transform: contentTransform }}
      className="relative z-10 h-full"
    >
      <div
        className={`h-full flex flex-col bg-surface rounded-[24px_8px_32px_12px] p-6 md:p-8 experience-card relative overflow-hidden group ${
          job.accentClass === 'primary' ? 'ambient-shadow-primary' : 'ambient-shadow-secondary'
        }`}
      >
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-secondary-fixed/20 rounded-full organic-shape-2 transition-transform duration-700 group-hover:scale-150 group-hover:bg-secondary-fixed/30" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className={`w-3 h-3 rounded-full shrink-0 ${
                job.accentClass === 'primary' ? 'bg-primary ring-4 ring-primary-fixed' : 'bg-outline-variant'
              }`}
            />
            <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-lg text-label-sm font-label-sm">
              {job.dates}
            </span>
          </div>
          <h2
            className={`text-headline-md font-headline-md mb-1 transition-colors ${
              job.accentClass === 'primary' ? 'text-primary' : 'text-secondary'
            }`}
          >
            {job.title}
          </h2>
          <h3 className="text-headline-sm font-headline-sm text-on-surface mb-5">{job.company}</h3>

          <ul className="space-y-3 mb-6">
            {job.bullets.map((bullet, bIdx) => (
              <li key={bIdx} className="flex items-start gap-4">
                <div
                  className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    bIdx % 2 === 0 ? 'bg-primary organic-shape-1' : 'bg-secondary organic-shape-2'
                  }`}
                />
                <span className="text-body-md font-body-md">{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 pt-4 mt-auto border-t border-outline-variant/30">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="text-label-sm font-label-sm px-3 py-1 rounded-full border border-outline-variant text-outline"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ExperienceSection() {
  const reduceMotion = useReducedMotion()
  const headerY = reduceMotion ? 0 : 70

  return (
    <section
      id="experience"
      className="snap-start snap-always min-h-dvh w-full flex items-center relative overflow-y-auto py-20"
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-fixed opacity-40 blur-[80px] rounded-full blob-1" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-secondary-fixed opacity-30 blur-[100px] rounded-full blob-2" />
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <motion.header
          className="mb-12 md:mb-14 relative z-10"
          initial={{ opacity: 0, y: headerY }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 140, damping: 16 }}
        >
          <div className="inline-block mb-6 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-xl organic-shape-1 font-label-bold text-label-bold">
            Professional Journey
          </div>
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary cursor-default text-balance">
            <span className="relative inline-block mt-2">
              <WaveHeading text="Work Experience." />
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-tertiary-fixed"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
              >
                <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg font-body-lg text-on-surface-variant text-pretty">
            Backend work at Stellantis building microservices for a vehicle insurance system.
            Machine learning research at IIT Bombay, comparing OCR models across languages.
          </p>
        </motion.header>

        <motion.div
          className="relative hidden md:grid grid-cols-2 gap-6 md:gap-8 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          aria-hidden="true"
        >
          <div className="absolute left-[10%] right-[10%] top-1/2 h-px bg-outline-variant/40 -translate-y-1/2" />
          {EXPERIENCE.map((job) => (
            <div key={job.company} className="relative flex justify-center">
              <span className="relative z-10 flex items-center gap-2 bg-background px-4">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    job.accentClass === 'primary'
                      ? 'bg-primary ring-4 ring-primary-fixed'
                      : 'bg-secondary ring-4 ring-secondary-fixed/40'
                  }`}
                />
                <span className="text-label-sm font-label-bold text-outline uppercase tracking-wide">
                  {job.dates}
                </span>
              </span>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {EXPERIENCE.map((job, index) => (
            <ExperienceCard key={job.company} job={job} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
