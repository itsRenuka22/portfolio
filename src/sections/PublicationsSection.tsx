import { motion } from 'framer-motion'
import WaveHeading from '../components/WaveHeading'
import { PUBLICATIONS } from '../data/publications'

export default function PublicationsSection() {
  return (
    <section
      id="publications"
      className="snap-start snap-always h-screen w-full flex items-start relative overflow-y-auto pt-28 pb-16"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-primary mb-16 relative inline-block cursor-default">
          <WaveHeading text="Publications" levels={[-12, -6, -2]} />
          <div className="absolute -bottom-2 left-0 w-full h-4 bg-tertiary-fixed -z-10 organic-shape" />
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter pb-8">
          {PUBLICATIONS.map((pub, i) => (
            <motion.div
              key={pub.title}
              className="pub-card-wrapper"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="pub-card bg-surface-container-lowest p-6 rounded-xl border-b-4 border-secondary shadow-vk-base h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span className="bg-secondary-container text-on-secondary-container text-label-sm font-label-sm py-1 px-3 organic-shape">
                    {pub.year}
                  </span>
                  <span className="material-symbols-outlined text-primary">menu_book</span>
                </div>
                <h3 className="text-headline-sm font-headline-sm mb-2 text-on-surface">{pub.title}</h3>
                <p className="text-body-md font-body-md text-on-surface-variant mb-4 flex-grow">{pub.venue}</p>
                <a
                  className="text-primary font-label-bold text-label-bold flex items-center gap-2 hover:text-primary-container active:scale-[0.97] transition-[color,transform]"
                  href={pub.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read Paper <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
