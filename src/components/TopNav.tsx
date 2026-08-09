import { SECTIONS } from '../data/sections'

interface TopNavProps {
  activeId: string
  onNavigate: (id: string) => void
}

export default function TopNav({ activeId, onNavigate }: TopNavProps) {
  const navLinks = SECTIONS.filter((s) => s.id !== 'home')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-[8px_8px_0px_0px_rgba(107,56,212,0.1)]">
      <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <button
          className="font-headline-sm text-headline-sm text-primary tracking-tighter"
          onClick={() => onNavigate('home')}
        >
          RP
        </button>
        <div className="hidden md:flex gap-gutter items-center">
          {navLinks
            .filter((s) => s.id !== 'contact')
            .map((s) => (
              <button
                key={s.id}
                onClick={() => onNavigate(s.id)}
                className={`font-body-md text-body-md transition-colors hover:scale-105 transition-transform duration-200 active:scale-95 ${
                  activeId === s.id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {s.navLabel}
              </button>
            ))}
        </div>
        <button
          onClick={() => onNavigate('contact')}
          className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-bold text-label-bold btn-pop transition-all"
        >
          Contact Me
        </button>
      </div>
    </nav>
  )
}
