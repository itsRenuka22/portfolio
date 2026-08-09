export interface SectionMeta {
  id: string
  navLabel: string
}

export const SECTIONS: SectionMeta[] = [
  { id: 'home', navLabel: 'Home' },
  { id: 'experience', navLabel: 'Experience' },
  { id: 'projects', navLabel: 'Projects' },
  { id: 'skills', navLabel: 'Skills' },
  { id: 'hackathons', navLabel: 'Hackathons' },
  { id: 'publications', navLabel: 'Publications' },
  { id: 'contact', navLabel: 'Contact' },
]
