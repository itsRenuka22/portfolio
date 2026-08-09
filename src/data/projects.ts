export type ProjectCategory = 'ai' | 'data' | 'fullstack'

export interface Project {
  title: string
  description?: string
  tags: string[]
  category: ProjectCategory
  github?: string
  liveUrl?: string
  badge?: string
}

export const PROJECT_CATEGORIES: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'ai', label: 'AI Agents & GenAI' },
  { id: 'data', label: 'Data & Backend Systems' },
  { id: 'fullstack', label: 'Full-Stack' },
]

export const PROJECTS: Project[] = [
  {
    title: 'DocQuery AI',
    description:
      'Delivered accurate, context-aware answers across multi-turn document queries via a RAG pipeline with FastAPI and Groq API for low-latency inference and cosine similarity retrieval; deployed cloud-native on AWS with Docker, React + TypeScript, S3, and DynamoDB.',
    tags: ['RAG', 'FastAPI', 'React', 'TypeScript', 'Groq API', 'AWS', 'S3', 'DynamoDB', 'Docker'],
    category: 'ai',
    github: 'https://github.com/itsRenuka22/DocQueryAI',
  },
  {
    title: 'CodeGuardian',
    description:
      'Reduced vulnerability detection time to 0.43s/scan via a FastAPI web service + CLI covering 13 OWASP/CWE categories; achieved 95.74% F1 with a Planner-Executor-Hybrid Critic multi-agent pipeline combining GraphRAG retrieval with LLM override logic, validated on a 120-case benchmark.',
    tags: ['Python', 'FastAPI', 'GraphRAG', 'ChromaDB', 'Gemini'],
    category: 'ai',
    github: 'https://github.com/itsRenuka22/codeguardian',
  },
  {
    title: 'DevLens',
    description:
      'Consolidated dev productivity signals across GitHub, Jira, and Google Calendar via Fivetran, using a Gemini-powered ADK agent on Vertex AI; integrated 2 MCP servers, streaming activity across 4 real-time SSE channels to a Next.js dashboard; deployed on Cloud Run with FastAPI async backend, 5 BigQuery metric views, Firestore session persistence.',
    tags: ['Python', 'FastAPI', 'Google ADK', 'MCP', 'BigQuery', 'Vertex AI', 'Cloud Run', 'Firestore', 'Next.js'],
    category: 'ai',
    github: 'https://github.com/itsRenuka22/DevLens',
    badge: 'Built at Google Cloud Rapid Agent Hackathon',
  },
  {
    title: 'PaperGap',
    description:
      'Engineered a 5-phase AI agent pipeline analyzing 250M+ research papers, surfacing top 3 underexplored research gaps per topic via parallel Nemotron agents scoring gap mentions, citation frontier detection, and concept isolation.',
    tags: ['Python', 'NVIDIA Nemotron', 'multi-agent orchestration'],
    category: 'ai',
    badge: 'Built at NVIDIA GTC Agents for Impact Hackathon',
  },
  {
    title: 'CSUCI Student Success Navigator',
    description: '96% corpus faithfulness / 94% answer faithfulness across a 140-question eval set.',
    tags: ['React 19', 'Vite', 'AWS Lambda', 'Bedrock', 'API Gateway', 'CloudFront'],
    category: 'ai',
    github: 'https://github.com/asherdrake/CSUCI-StudentSuccessNavigator',
  },
  {
    title: 'VeriFi',
    description:
      'Sustained 155.8 TPS at 12ms p95 latency for real-time fraud detection via a distributed Kafka pipeline validated with Locust; XGBoost model at 0.8295 ROC AUC combined with 8 rule-based fraud signals; Prometheus/Grafana observability across a 5-microservice GKE deployment with HPA and health probes.',
    tags: ['Kafka', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes', 'Grafana', 'XGBoost'],
    category: 'data',
    github: 'https://github.com/itsRenuka22/VeriFi',
  },
  {
    title: 'Startup-Radar',
    tags: ['Python', 'Flask', 'React 19', 'Vite', 'Bright Data API'],
    category: 'data',
    badge: 'Built at AWS Loft',
  },
  {
    title: 'Data Mining Course Project',
    tags: ['TBD'],
    category: 'data',
    liveUrl: 'https://colab.research.google.com/drive/1WqaTcQAZLWTRWKg4e0uCtfTBgaa960zj',
  },
  {
    title: 'Campus Marketplace (CMPE 202)',
    tags: [
      'React 18',
      'TypeScript',
      'Spring Boot',
      'PostgreSQL',
      'WebSocket/STOMP',
      'Gemini API',
      'Docker',
      'Terraform',
      'AWS (RDS/ALB/ASG)',
    ],
    category: 'fullstack',
  },
  {
    title: 'Pawnder (CMPE 285)',
    tags: ['React 19', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
    category: 'fullstack',
  },
]
