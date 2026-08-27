import { useCallback, useRef } from 'react'
import TopNav from './components/TopNav'
import ProgressRail from './components/ProgressRail'
import { SECTIONS } from './data/sections'
import { useActiveSection } from './hooks/useActiveSection'
import { ScrollContainerContext } from './context/ScrollContainerContext'
import HomeSection from './sections/HomeSection'
import ExperienceSection from './sections/ExperienceSection'
import ProjectsSection from './sections/ProjectsSection'
import SkillsSection from './sections/SkillsSection'
import HackathonsSection from './sections/HackathonsSection'
import PublicationsSection from './sections/PublicationsSection'
import ContactSection from './sections/ContactSection'

const SECTION_IDS = SECTIONS.map((s) => s.id)

function App() {
  const activeId = useActiveSection(SECTION_IDS)
  const mainRef = useRef<HTMLElement>(null)

  const handleNavigate = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-primary px-4 py-2 font-label-bold text-label-bold text-on-primary transition-transform duration-200 focus:translate-y-0"
      >
        Skip to content
      </a>
      <TopNav activeId={activeId} onNavigate={handleNavigate} />
      <ProgressRail activeId={activeId} onNavigate={handleNavigate} />
      <ScrollContainerContext.Provider value={mainRef}>
        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth outline-none"
        >
          <HomeSection />
          <ExperienceSection />
          <ProjectsSection />
          <SkillsSection />
          <HackathonsSection />
          <PublicationsSection />
          <ContactSection />
        </main>
      </ScrollContainerContext.Provider>
    </>
  )
}

export default App
