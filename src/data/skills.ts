export interface SkillCategory {
  name: string
  icon: string
  skills: string[]
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Languages',
    icon: 'code',
    skills: ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL', 'HTML', 'CSS'],
  },
  {
    name: 'Cloud & Infra',
    icon: 'cloud',
    skills: [
      'AWS',
      'Bedrock',
      'SageMaker',
      'Lambda',
      'CloudFront',
      'DynamoDB',
      'S3',
      'EC2',
      'IAM',
      'RDS',
      'ALB',
      'Auto Scaling',
      'GCP',
      'GKE',
      'Vertex AI',
      'BigQuery',
      'Cloud Run',
      'Terraform',
    ],
  },
  {
    name: 'Backend',
    icon: 'database',
    skills: [
      'Spring',
      'Spring Boot',
      'Microservices',
      'REST APIs',
      'Kafka',
      'PostgreSQL',
      'MySQL',
      'Redis',
      'WebSocket/STOMP',
      'JWT/BCrypt',
    ],
  },
  {
    name: 'AI & Agents',
    icon: 'psychology',
    skills: [
      'PyTorch',
      'Scikit-learn',
      'NumPy',
      'Pandas',
      'GraphRAG',
      'ChromaDB',
      'NVIDIA Nemotron',
      'Google ADK',
      'MCP',
      'Fivetran',
    ],
  },
  {
    name: 'Frontend',
    icon: 'desktop_windows',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Streamlit', 'Flask'],
  },
  {
    name: 'AI Assistants',
    icon: 'smart_toy',
    skills: ['Claude Code', 'Codex', 'Cursor', 'Gemini', 'GitHub Copilot'],
  },
  {
    name: 'Tools & Testing',
    icon: 'build',
    skills: ['Pytest', 'JUnit 5', 'Mockito', 'Docker', 'Swagger', 'Postman', 'GitHub', 'Prometheus', 'Grafana'],
  },
]
