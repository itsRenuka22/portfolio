import { motion, useMotionTemplate, useReducedMotion } from 'framer-motion'
import ParticleBackground from '../components/ParticleBackground'
import { useSectionParallax, useParallaxOffset } from '../hooks/useSectionParallax'

const CONTACT_DETAILS = [
  { icon: 'location_on', label: 'Location', value: 'San Jose, CA', bg: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  { icon: 'call', label: 'Phone', value: '408-591-0850', bg: 'bg-secondary-container text-on-secondary-container' },
  {
    icon: 'mail',
    label: 'Email',
    value: 'renukaprasad.patwari@sjsu.edu',
    bg: 'bg-primary-container text-on-primary-container',
    href: 'mailto:renukaprasad.patwari@sjsu.edu',
  },
]

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/renuka-patwari', hoverBg: 'hover:bg-primary hover:text-on-primary' },
  { label: 'GitHub', href: 'https://github.com/itsRenuka22', hoverBg: 'hover:bg-secondary hover:text-on-secondary' },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

export default function ContactSection() {
  const { sectionRef, progress } = useSectionParallax<HTMLElement>()
  const bgY = useParallaxOffset(progress, 30)
  const cardY = useParallaxOffset(progress, 12)
  const bgTransform = useMotionTemplate`translateY(${bgY}px)`
  const cardTransform = useMotionTemplate`translateY(${cardY}px)`
  const reduceMotion = useReducedMotion()
  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 56, scale: reduceMotion ? 1 : 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 180, damping: 17 } },
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="snap-start snap-always h-screen w-full flex items-center relative overflow-y-auto"
    >
      <motion.div className="contact-parallax-bg animated-gradient-bg absolute inset-0" style={{ transform: bgTransform }}>
        <ParticleBackground />
      </motion.div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full relative z-10">
        <motion.div className="relative" style={{ transform: cardTransform }}>
          <div className="absolute inset-0 bg-surface-container-low rounded-[40px] transform rotate-1 -z-10" />
          <motion.div
            className="bg-surface-container-lowest p-8 md:p-16 rounded-[32px] shadow-vk-base hover:shadow-vk-active transition-shadow duration-300"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.h2 variants={itemVariants} className="text-headline-md font-headline-md text-on-surface mb-8">
              Let's Connect
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                {CONTACT_DETAILS.map((detail) => (
                  <motion.a
                    key={detail.label}
                    variants={itemVariants}
                    href={detail.href}
                    className="flex items-center gap-4 group cursor-pointer active:opacity-70 transition-opacity"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${detail.bg}`}
                    >
                      <span className="material-symbols-outlined">{detail.icon}</span>
                    </div>
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">{detail.label}</p>
                      <p className="text-body-lg font-body-lg font-bold text-on-surface">{detail.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
              <div className="flex flex-col justify-center gap-6">
                <motion.h3
                  variants={itemVariants}
                  className="text-label-bold font-label-bold text-on-surface-variant uppercase tracking-widest"
                >
                  Social Profiles
                </motion.h3>
                {SOCIALS.map((social) => (
                  <motion.a
                    key={social.label}
                    variants={itemVariants}
                    className={`wobble-box bg-surface-container-high p-4 flex items-center justify-between active:opacity-70 transition-[color,opacity] duration-300 ${social.hoverBg}`}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="text-body-lg font-body-lg font-bold">{social.label}</span>
                    <span className="material-symbols-outlined">arrow_outward</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
