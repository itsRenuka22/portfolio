import { motion } from 'framer-motion'
import WaveHeading from '../components/WaveHeading'
import { EXPERIENCE } from '../data/experience'

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="snap-start snap-always h-screen w-full flex items-start relative overflow-y-auto pt-28 pb-16"
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-fixed opacity-40 blur-[80px] rounded-full blob-1" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-secondary-fixed opacity-30 blur-[100px] rounded-full blob-2" />
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <motion.header
          className="mb-16 md:mb-20 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-block mb-6 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-xl organic-shape-1 font-label-bold text-label-bold">
            Professional Journey
          </div>
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary cursor-default">
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
          <p className="mt-8 max-w-2xl text-body-lg font-body-lg text-on-surface-variant">
            From secure microservices to multilingual OCR pipelines — building reliable systems and
            proving it with test coverage and clean deployments.
          </p>
        </motion.header>

        <div className="relative space-y-16 md:space-y-24">
          <div className="hidden md:block absolute left-8 top-12 bottom-12 w-0.5 bg-outline-variant/30 z-0" />

          {EXPERIENCE.map((job, idx) => (
            <motion.div
              key={job.company}
              className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
            >
              <div className="hidden md:flex flex-col items-center shrink-0 w-16">
                <div
                  className={`w-4 h-4 rounded-full mt-2 ${
                    job.accentClass === 'primary' ? 'bg-primary ring-4 ring-primary-fixed' : 'bg-outline-variant'
                  }`}
                />
              </div>

              <div className="flex-1">
                <div
                  className={`bg-surface rounded-[24px_8px_32px_12px] p-6 md:p-10 experience-card relative overflow-hidden group ${
                    job.accentClass === 'primary' ? 'ambient-shadow-primary' : 'ambient-shadow-secondary'
                  }`}
                >
                  <div className="absolute -right-16 -top-16 w-32 h-32 bg-secondary-fixed/20 rounded-full organic-shape-2 transition-transform duration-700 group-hover:scale-150 group-hover:bg-secondary-fixed/30" />
                  <div className="relative z-10">
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-lg text-label-sm font-label-sm">
                        {job.dates}
                      </span>
                    </div>
                    <h2
                      className={`text-headline-md font-headline-md mb-2 transition-colors ${
                        job.accentClass === 'primary' ? 'text-primary' : 'text-secondary'
                      }`}
                    >
                      {job.title}
                    </h2>
                    <h3 className="text-headline-sm font-headline-sm text-on-surface mb-6">{job.company}</h3>

                    <ul className="space-y-4 mb-8">
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

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/30">
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
