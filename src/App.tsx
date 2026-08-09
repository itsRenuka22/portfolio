import { useCallback } from 'react'
import TopNav from './components/TopNav'
import ProgressRail from './components/ProgressRail'
import { SECTIONS } from './data/sections'
import { useActiveSection } from './hooks/useActiveSection'
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

  const handleNavigate = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <TopNav activeId={activeId} onNavigate={handleNavigate} />
      <ProgressRail activeId={activeId} onNavigate={handleNavigate} />
      <main className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        <HomeSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <HackathonsSection />
        <PublicationsSection />
        <ContactSection />
      </main>
    </>
  )
}

export default App
