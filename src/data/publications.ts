export interface Publication {
  title: string
  venue: string
  year: string
  link: string
}

export const PUBLICATIONS: Publication[] = [
  {
    title: 'Introduction to Generative AI',
    venue: 'Generative AI: Disruptive Technologies for Innovative Applications, Wiley',
    year: '2025',
    link: 'https://doi.org/10.1002/9781394302932.ch1',
  },
  {
    title: 'MedInsight: A Personalized Prescription Recommendation Using Machine Learning',
    venue: 'EGETC 2024, Springer',
    year: '2024',
    link: 'https://link.springer.com/chapter/10.1007/978-3-031-77029-6_10',
  },
  {
    title: 'Automatic Recognition of Non-standard Number Plates using YOLOv8',
    venue: 'INDIACom 2024, IEEE',
    year: '2024',
    link: 'https://doi.org/10.23919/INDIACom61295.2024.10498740',
  },
]
