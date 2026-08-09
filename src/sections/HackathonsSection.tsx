import { motion } from 'framer-motion'
import WaveHeading from '../components/WaveHeading'
import { useDebouncedConfetti } from '../hooks/useDebouncedConfetti'
import { HACKATHONS, type HackathonEntry } from '../data/hackathons'

function HackathonCard({ entry, index }: { entry: HackathonEntry; index: number }) {
  const { cardRef, onHoverStart } = useDebouncedConfetti()
  const reverse = index % 2 === 1
  const isFeatured = index === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative z-10"
    >
      <div
        ref={cardRef}
        onMouseEnter={entry.confetti ? onHoverStart : undefined}
        className={`rounded-xl flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} shadow-sm hover-pop overflow-hidden border ${
          isFeatured
            ? 'bg-primary text-on-primary border-transparent shadow-ambient-primary'
            : 'bg-surface-container-lowest border-surface-variant'
        }`}
      >
        <div
          className={`md:w-1/2 relative p-8 flex items-center justify-center min-h-[220px] ${
            isFeatured ? 'bg-primary-container' : 'bg-surface-container'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[72px] ${isFeatured ? 'text-on-primary/60' : 'text-primary/30'}`}
          >
            emoji_events
          </span>
        </div>
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {entry.badge && (
            <span
              className={`inline-block self-start px-3 py-1 text-label-sm font-label-sm rounded-full mb-3 shadow-sm ${
                isFeatured ? 'bg-tertiary text-on-tertiary' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
              }`}
            >
              {entry.badge}
            </span>
          )}
          <h3 className={`text-headline-md font-headline-md mb-1 ${isFeatured ? 'text-on-primary' : 'text-primary'}`}>
            {entry.title}
          </h3>
          {entry.subtitle && (
            <p className={`text-label-bold font-label-bold mb-2 ${isFeatured ? 'text-tertiary-fixed' : 'text-secondary'}`}>
              {entry.subtitle}
            </p>
          )}
          <p className={`text-label-bold font-label-bold mb-4 ${isFeatured ? 'text-primary-fixed-dim' : 'text-outline'}`}>
            {entry.date}
          </p>
          <p className={`text-body-md font-body-md mb-6 ${isFeatured ? 'text-on-primary-container opacity-90' : 'text-on-surface-variant'}`}>
            {entry.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-md text-label-sm font-label-sm ${
                  isFeatured ? 'bg-on-primary text-primary font-bold' : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          {entry.link && (
            <a
              className={`inline-flex items-center gap-2 font-label-bold text-label-sm hover:underline mt-4 ${
                isFeatured ? 'text-on-primary' : 'text-primary'
              }`}
              href={entry.link}
              target="_blank"
              rel="noreferrer"
            >
              View Project <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function HackathonsSection() {
  return (
    <section
      id="hackathons"
      className="snap-start snap-always h-screen w-full flex items-start relative overflow-y-auto pt-28 pb-16"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <div className="mb-16 max-w-3xl relative">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-tertiary-fixed rounded-full opacity-50 blur-xl -z-10" />
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary mb-6 relative z-10 cursor-default">
            <WaveHeading text="Hackathons &" levels={[-15, -8]} />
            <br />
            <span className="text-on-background relative inline-block">
              <span className="relative z-10">
                <WaveHeading text="Extracurriculars" levels={[-15, -8]} />
              </span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-tertiary-fixed -z-10 -rotate-2 origin-left" />
            </span>
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
            Hackathons are my sandbox — where sleep deprivation meets rapid prototyping, and ideas turn
            into working software in a weekend.
          </p>
        </div>

        <div className="flex flex-col gap-10 pb-8">
          {HACKATHONS.map((entry, i) => (
            <HackathonCard key={entry.title} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
