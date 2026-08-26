import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProximityWaveHeading from '../components/ProximityWaveHeading'
import { PROJECT_CATEGORIES, PROJECTS, type ProjectCategory } from '../data/projects'

const THUMB_ICONS: Record<ProjectCategory, string> = {
  ai: 'neurology',
  data: 'database',
  fullstack: 'dashboard',
}

const THUMB_SHAPE_CLASSES = ['blob-bg', 'rounded-tr-[40px]', 'rounded-bl-[40px]', '', 'rounded-br-[40px]']

function renderBoldText(text: string) {
  return text.split(/(\*\*.+?\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-bold text-on-surface">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )
}

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'all'>('all')

  const filtered = useMemo(
    () => PROJECTS.filter((p) => activeFilter === 'all' || p.category === activeFilter),
    [activeFilter],
  )

  return (
    <section
      id="projects"
      className="snap-start snap-always h-screen w-full flex items-start relative overflow-y-auto pt-28 pb-16"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <div className="mb-16 relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl z-0" />
          <ProximityWaveHeading
            text="Selected Works"
            className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary relative z-10 mb-2 flex flex-wrap cursor-default"
          />
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl relative z-10">
            A collection of projects spanning generative AI, robust backend architectures, and full-stack
            experiences. Filter below to explore specific domains.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`filter-btn px-6 py-2 rounded-full border-2 border-primary text-primary font-label-bold text-label-bold transition-all duration-200 bg-surface hover:bg-primary-fixed ${
                activeFilter === cat.id ? 'active' : ''
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="project-card bg-surface-container-lowest rounded-xl border-b-4 border-secondary-container p-6 flex flex-col h-full">
                  <div
                    className={`h-32 w-full bg-gradient-to-br from-primary/15 via-secondary-container/40 to-tertiary-fixed/20 rounded-lg mb-6 relative overflow-hidden flex items-center justify-center ${THUMB_SHAPE_CLASSES[idx % THUMB_SHAPE_CLASSES.length]}`}
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} thumbnail`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-primary/50 text-[40px]">
                        {THUMB_ICONS[project.category]}
                      </span>
                    )}
                  </div>

                  {project.badge && (
                    <span className="inline-block self-start mb-3 bg-tertiary-fixed text-on-tertiary-fixed px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {project.badge}
                    </span>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-secondary-fixed text-on-secondary-fixed px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-headline-sm font-headline-sm text-primary mb-2">{project.title}</h3>
                  {project.bullets ? (
                    <ul className="text-body-md font-body-md text-on-surface-variant flex-grow mb-6 space-y-1.5 list-disc list-outside pl-4">
                      {project.bullets.map((bullet, i) => (
                        <li key={i}>{renderBoldText(bullet)}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex-grow mb-6" />
                  )}

                  <div className="flex gap-4 mt-auto">
                    {project.github && (
                      <a
                        className="text-primary font-label-bold text-label-bold flex items-center gap-1 hover:text-primary-container transition-colors"
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="material-symbols-outlined text-[18px]">code</span> Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        className="text-secondary font-label-bold text-label-bold flex items-center gap-1 hover:text-on-secondary-container transition-colors"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span> View
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
