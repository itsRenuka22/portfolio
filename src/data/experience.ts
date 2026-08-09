export interface ExperienceEntry {
  title: string
  company: string
  dates: string
  bullets: string[]
  tags: string[]
  accentClass: 'primary' | 'secondary'
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    title: 'Assistant Software Engineer',
    company: 'Stellantis',
    dates: 'Sept 2024 – Jul 2025',
    bullets: [
      'Delivered secure policy creation, search, and renewal workflows by building object-oriented Java Spring Boot microservices for a Vehicle Insurance System using JDBC, Eureka, and H2.',
      'Increased unit test coverage from 3% to 90% using JUnit 5 and Mockito, identifying and resolving critical test gaps to strengthen overall code quality.',
    ],
    tags: ['Java', 'Spring Boot', 'JDBC', 'Eureka', 'H2', 'JUnit 5', 'Mockito'],
    accentClass: 'primary',
  },
  {
    title: 'Machine Learning Intern',
    company: 'IIT Bombay',
    dates: 'Sep 2023 – Mar 2024',
    bullets: [
      'Improved model selection accuracy by evaluating 3 AI models (PyTesseract, DocTr, Google Vision API) across multilingual scripts to identify the best-performing OCR solution for the LEAP OCR project.',
      'Accelerated deployment reliability by containerizing the application with Docker and documenting REST APIs with Swagger and Postman, enabling reproducible and consistent model iteration.',
    ],
    tags: ['PyTesseract', 'DocTr', 'Google Vision API', 'Docker', 'Swagger', 'Postman'],
    accentClass: 'secondary',
  },
]
