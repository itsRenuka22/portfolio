import docQueryAiThumb from '../assets/projects/DocQueryAI.png'
import codeGuardianThumb from '../assets/projects/CodeGuardian.png'
import devLensThumb from '../assets/projects/DevLensAi.png'
import paperGapThumb from '../assets/projects/PaperGap.png'
import studentSuccessNavigatorThumb from '../assets/projects/StudentSuccessNavigator.png'
import veriFiThumb from '../assets/projects/VeriFi.png'
import oneTableThumb from '../assets/projects/OneTable.png'
import campusMarketplaceThumb from '../assets/projects/CampusMarketPlace.png'
import pawnderThumb from '../assets/projects/Pawnder.png'
import mortgageRiskThumb from '../assets/projects/ExplainableMortgageLending.png'

export type ProjectCategory = 'ai' | 'data' | 'fullstack'

export interface Project {
  title: string
  bullets?: string[]
  tags: string[]
  category: ProjectCategory
  github?: string
  liveUrl?: string
  badge?: string
  image?: string
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
    bullets: [
      'PDF Q&A on AWS: FastAPI + Gemini 2.0 Flash, EC2/S3/DynamoDB',
      'Minimal-permission IAM policy, Dockerized deploy',
      'Next.js 15 + Tailwind frontend, multi-PDF session history',
    ],
    tags: ['FastAPI', 'Gemini API', 'Next.js', 'TypeScript', 'AWS (EC2, S3, DynamoDB)', 'Docker'],
    category: 'ai',
    github: 'https://github.com/itsRenuka22/DocQueryAI',
    image: docQueryAiThumb,
  },
  {
    title: 'CodeGuardian',
    bullets: [
      '**0.43s/scan** vulnerability detection, **13 OWASP/CWE** categories',
      '**95.74% F1** via GraphRAG + LLM-critic multi-agent pipeline',
      'Validated on a **120-case** benchmark',
    ],
    tags: ['Python', 'FastAPI', 'GraphRAG', 'ChromaDB', 'Gemini'],
    category: 'ai',
    github: 'https://github.com/itsRenuka22/codeguardian',
    image: codeGuardianThumb,
  },
  {
    title: 'DevLens',
    bullets: [
      'Unified dev signals from **3 tools** (GitHub, Jira, Calendar) via Gemini ADK agent',
      '**2 MCP servers**, **4 real-time SSE** channels to a Next.js dashboard',
      'Cloud Run + FastAPI, **5 BigQuery** views, Firestore persistence',
    ],
    tags: ['Python', 'FastAPI', 'Google ADK', 'MCP', 'BigQuery', 'Vertex AI', 'Firestore', 'Next.js'],
    category: 'ai',
    github: 'https://github.com/itsRenuka22/DevLens',
    badge: 'Built at Google Cloud Rapid Agent Hackathon',
    image: devLensThumb,
  },
  {
    title: 'PaperGap',
    bullets: [
      'Scanned **250M+ papers** with 5-phase parallel Nemotron agent pipeline',
      'Surfaced **top 3** research gaps per topic',
    ],
    tags: ['Python', 'NVIDIA Nemotron', 'multi-agent orchestration'],
    category: 'ai',
    github: 'https://github.com/itsRenuka22/nvda-nemotron-agent',
    badge: 'Built at NVIDIA GTC Agents for Impact Hackathon',
    image: paperGapThumb,
  },
  {
    title: 'Ekho (CSUCI Student Success Navigator)',
    bullets: [
      'RAG chatbot for CSU Channel Islands, shipped in **1 week**',
      '**96%** corpus faithfulness, **94%** answer faithfulness (140-question eval)',
    ],
    tags: ['React 19', 'Vite', 'AWS Lambda', 'Bedrock', 'API Gateway', 'CloudFront'],
    category: 'ai',
    github: 'https://github.com/itsRenuka22/CSUCI-StudentSuccessNavigator',
    image: studentSuccessNavigatorThumb,
  },
  {
    title: 'VeriFi',
    bullets: [
      '**155.8 TPS** at **12ms p95** for real-time fraud detection, Kafka pipeline',
      '**0.8295 ROC AUC**: XGBoost + 8 rule-based signals',
      'Prometheus/Grafana across **5-microservice** GKE deployment',
    ],
    tags: ['Kafka', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes', 'Grafana', 'XGBoost'],
    category: 'data',
    github: 'https://github.com/itsRenuka22/VeriFi',
    image: veriFiThumb,
  },
  {
    title: 'OneTable',
    bullets: [
      "Memory layer recalling each diner's constraints across a session",
      'Live order negotiation through mid-session preference changes',
      'Checkout flow writing outcomes back to memory',
    ],
    tags: ['Next.js', 'TypeScript', 'Agent Memory', 'Negotiation Engine'],
    category: 'data',
    github: 'https://github.com/itsRenuka22/OneTable',
    badge: 'Built at Xtrace Agent Memory Hackathon (Winner)',
    image: oneTableThumb,
  },
  {
    title: 'Explainable Mortgage Lending Risk Intelligence',
    bullets: [
      'Predicted mortgage lending risk on 2022 HMDA data (CA conventional home purchase loans)',
      'Owned advanced modeling + hyperparameter tuning across Logistic Regression, Random Forest, XGBoost',
      'SHAP-based explainability + fairness analysis across demographic groups',
    ],
    tags: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'SHAP', 'Jupyter'],
    category: 'data',
    github: 'https://github.com/itsRenuka22/255_hmda-mortgage-risk-intelligence-',
    liveUrl: 'https://colab.research.google.com/drive/1WqaTcQAZLWTRWKg4e0uCtfTBgaa960zj',
    image: mortgageRiskThumb,
  },
  {
    title: 'Campus Marketplace (CMPE 202)',
    bullets: [
      'AI shopping assistant UI, **8-state** conversation flow, Gemini function calling',
      'Auth, protected routes, moderation flow',
      'Docker + Terraform on AWS (RDS, ALB, EC2 Auto Scaling)',
    ],
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
    github: 'https://github.com/itsRenuka22/CampusMarketPlace',
    image: campusMarketplaceThumb,
  },
  {
    title: 'Pawnder (CMPE 285)',
    bullets: ['Full-stack swipe-voting app, React 19 + Supabase, Postgres RLS'],
    tags: ['React 19', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
    category: 'fullstack',
    github: 'https://github.com/itsRenuka22/Pawnder',
    image: pawnderThumb,
  },
]
