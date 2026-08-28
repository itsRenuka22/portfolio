import { SECTIONS } from '../data/sections'

interface ProgressRailProps {
  activeId: string
  onNavigate: (id: string) => void
}

export default function ProgressRail({ activeId, onNavigate }: ProgressRailProps) {
  return (
    <div className="glass-surface fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-4 rounded-full px-2.5 py-4">
      {SECTIONS.map((s) => {
        const isActive = s.id === activeId
        return (
          <button
            key={s.id}
            onClick={() => onNavigate(s.id)}
            aria-label={`Jump to ${s.navLabel}`}
            className="group relative flex items-center justify-center"
          >
            <span
              className={`block w-2 h-2 rounded-full transition-[transform,background-color] duration-300 ${
                isActive ? 'scale-150 bg-primary' : 'bg-outline-variant group-hover:bg-primary/60'
              }`}
            />
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-on-surface text-inverse-on-surface px-2 py-1 font-label-sm text-label-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {s.navLabel}
            </span>
          </button>
        )
      })}
    </div>
  )
}
