import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { SECTIONS } from '../data/sections'

interface TopNavProps {
  activeId: string
  onNavigate: (id: string) => void
}

export default function TopNav({ activeId, onNavigate }: TopNavProps) {
  const navLinks = SECTIONS
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()

  const closeMenu = () => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('overflow-hidden')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('overflow-hidden')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen])

  const handleNavigate = (id: string) => {
    setMenuOpen(false)
    onNavigate(id)
  }

  return (
    <>
      <nav className="glass-surface fixed top-0 left-0 right-0 z-50 shadow-[8px_8px_0px_0px_rgba(107,56,212,0.1)]">
        <div className="relative z-50 flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
          <button
            className="font-headline-sm text-headline-sm text-primary tracking-tighter"
            onClick={() => handleNavigate('home')}
          >
            RP
          </button>
          <div className="hidden md:flex gap-gutter items-center">
            {navLinks
              .filter((s) => s.id !== 'contact')
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleNavigate(s.id)}
                  className={`relative pb-1 font-body-md text-body-md transition-[color,transform] duration-200 hover:scale-105 active:scale-95 ${
                    activeId === s.id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {s.navLabel}
                  {activeId === s.id && (
                    <motion.span
                      layoutId="topnav-active-indicator"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-primary"
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    />
                  )}
                </button>
              ))}
          </div>
          <button
            onClick={() => handleNavigate('contact')}
            className="hidden md:inline-flex bg-primary text-on-primary px-6 py-2 rounded-full font-label-bold text-label-bold btn-pop transition-[transform,box-shadow] active:scale-[0.97]"
          >
            Contact Me
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 rounded-full text-on-surface active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[28px]">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-nav-menu"
              className="md:hidden absolute left-0 right-0 top-full z-50 bg-surface-container-lowest border-t border-outline-variant/40 shadow-[0_16px_32px_rgba(107,56,212,0.12)]"
              initial={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul className="flex flex-col px-margin-mobile py-3">
                {navLinks.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => handleNavigate(s.id)}
                      className={`w-full text-left py-3 font-body-md text-body-md transition-colors ${
                        activeId === s.id ? 'text-primary font-label-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      {s.navLabel}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Rendered as a sibling of <nav>, not inside it — `.glass-surface`'s
          backdrop-filter would otherwise become the containing block for this
          `fixed`-position backdrop (per spec, filter/backdrop-filter on an
          ancestor does that), shrinking it down to the nav bar's own height
          instead of covering the viewport. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.button
            type="button"
            aria-label="Dismiss menu"
            onClick={closeMenu}
            className="md:hidden fixed inset-0 z-40 bg-on-surface/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
