import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import WaveHeading from '../components/WaveHeading'
import { useDebouncedConfetti } from '../hooks/useDebouncedConfetti'
import { HACKATHONS, type HackathonEntry, type HackathonSize } from '../data/hackathons'

// Per-tile drift offsets so tiles don't settle in mechanical unison — this is a
// one-time settle-on-entrance effect (not continuous scroll tracking), since several
// independently-drifting backgrounds in a dense grid reads as noisy rather than depth.
const PARALLAX_OFFSETS = [-14, 10, -8, 12, -9, 11]

const SIZE_CLASSES: Record<HackathonSize, string> = {
  large: 'md:col-span-2 md:row-span-2',
  wideTop: 'md:col-span-2 md:row-span-1',
  square: 'md:col-span-1 md:row-span-1',
  wideBottom: 'md:col-span-3 md:row-span-1',
}

function HackathonTile({
  entry,
  index,
  onOpen,
}: {
  entry: HackathonEntry
  index: number
  onOpen: () => void
}) {
  const { cardRef, onHoverStart } = useDebouncedConfetti()
  const isCompact = entry.size === 'square'
  const reduceMotion = useReducedMotion()
  const bgOffset = reduceMotion ? 0 : PARALLAX_OFFSETS[index % PARALLAX_OFFSETS.length]
  const tileY = reduceMotion ? 0 : 56
  const tileScale = reduceMotion ? 1 : 0.87

  const handleOpen = () => {
    if (entry.confetti) onHoverStart()
    onOpen()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: tileY, scale: tileScale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 180, damping: 17, delay: index * 0.1 }}
      className={`${SIZE_CLASSES[entry.size]} relative`}
    >
      <button
        ref={cardRef as never}
        type="button"
        onClick={handleOpen}
        className="group relative flex h-full min-h-[220px] w-full flex-col overflow-hidden rounded-xl border border-surface-variant bg-surface-container-lowest text-left shadow-sm grayscale transition-[transform,filter,box-shadow] duration-[250ms] ease-out hover:-translate-y-1 hover:scale-[1.02] hover:grayscale-0 hover:shadow-2xl hover:z-10"
      >
        {entry.image ? (
          <motion.div
            className="hackathon-parallax-bg"
            initial={{ y: bgOffset }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: index * 0.08 + 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={entry.image}
              alt={`${entry.title} photo`}
              className="hackathon-parallax-img h-full w-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/25 via-transparent to-transparent">
            <span
              style={{ fontSize: isCompact ? 90 : 160 }}
              className="material-symbols-outlined absolute -top-4 -right-4 text-primary/35 transition-colors duration-500 group-hover:text-primary/50"
            >
              {entry.icon ?? 'emoji_events'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="hackathon-parallax-fg relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
          {entry.showBadgeOnCard && entry.badge && (
            <span className="mb-3 inline-block self-start rounded-full bg-tertiary-fixed px-3 py-1 text-label-sm font-label-sm text-on-tertiary-fixed-variant shadow-sm">
              {entry.badge}
            </span>
          )}
          <h3
            className={`font-headline-md text-white ${
              isCompact ? 'text-headline-sm font-headline-sm' : 'text-headline-md'
            }`}
          >
            {entry.title}
          </h3>
        </div>
      </button>
    </motion.div>
  )
}

function HackathonModal({ entry, onClose }: { entry: HackathonEntry; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('overflow-hidden')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('overflow-hidden')
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12"
    >
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-surface-variant bg-surface p-6">
          {entry.badge ? (
            <span className="inline-block rounded-full bg-tertiary-fixed px-3 py-1 text-label-sm font-label-sm text-on-tertiary-fixed-variant shadow-sm">
              {entry.badge}
            </span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="group rounded-full p-2 text-on-surface-variant active:scale-90 transition-[color,background-color,transform] hover:bg-surface-variant"
            aria-label="Close"
          >
            <span className="material-symbols-outlined transition-transform group-hover:scale-110">
              close
            </span>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col justify-center p-6 md:w-2/5 md:p-10">
              <h2 className="text-headline-md font-headline-md text-primary mb-1">{entry.title}</h2>
              {entry.subtitle && (
                <p className="mb-1 text-label-bold font-label-bold text-secondary">{entry.subtitle}</p>
              )}
              <p className="mb-6 text-label-bold font-label-bold text-outline">{entry.date}</p>
              <p className="mb-8 text-body-md font-body-md text-on-surface-variant">{entry.description}</p>
              <div className="mb-8 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-surface-container-high px-3 py-1 text-label-sm font-label-sm text-on-surface-variant"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {entry.link && (
                <a
                  className="mt-auto inline-flex items-center gap-2 self-start text-label-sm font-label-bold text-primary hover:underline"
                  href={entry.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Repo <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                </a>
              )}
            </div>

            <div className="relative min-h-[320px] bg-surface-container md:w-3/5">
              {entry.image ? (
                <img
                  src={entry.image}
                  alt={`${entry.title} photo`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-container/30 via-transparent to-transparent">
                  <span className="material-symbols-outlined text-primary/40" style={{ fontSize: 220 }}>
                    {entry.icon ?? 'emoji_events'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HackathonsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="hackathons"
      className="snap-start snap-always h-screen w-full flex items-start relative overflow-y-auto pt-28 pb-16"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 140, damping: 16 }}
          className="mb-16 max-w-3xl relative"
        >
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
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl text-pretty">
            Hackathons are my sandbox — where sleep deprivation meets rapid prototyping, and ideas turn
            into working software in a weekend.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(220px,auto)] pb-8">
          {HACKATHONS.map((entry, i) => (
            <HackathonTile key={entry.title} entry={entry} index={i} onOpen={() => setOpenIndex(i)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <HackathonModal entry={HACKATHONS[openIndex]} onClose={() => setOpenIndex(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
