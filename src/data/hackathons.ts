export interface HackathonEntry {
  title: string
  subtitle?: string
  badge?: string
  date: string
  description: string
  tags: string[]
  link?: string
  confetti?: boolean
}

export const HACKATHONS: HackathonEntry[] = [
  {
    title: 'SJSU AWS Cloudathon',
    badge: '2nd Place / 300+ Participants',
    date: 'May 2026',
    description:
      'Secured AWS infrastructure across 14 challenges in 4 hours: CloudFront + ALB origin protection, RDS/S3 encryption, Lambda/Systems Manager automation; diagnosed and restored failed services under time pressure (security group misconfigurations, IAM policy violations, EC2 metadata issues).',
    tags: ['CloudFront', 'ALB', 'RDS', 'S3', 'Lambda', 'Systems Manager', 'IAM', 'EC2'],
    confetti: true,
  },
  {
    title: 'Xtrace Agent Memory Hackathon',
    subtitle: 'OneTable',
    badge: 'Winner',
    date: 'Xtrace Hackathon',
    description:
      "OneTable is a memory-powered group dining agent built for the MenuSifu Track 1 challenge (Xtrace hackathon) — it recalls each diner's constraints, negotiates a group order, reacts to membership/preference changes mid-session, and completes checkout, writing outcomes back to memory.",
    tags: ['Next.js', 'TypeScript'],
    link: 'https://github.com/mohiitt/OneTable',
    confetti: true,
  },
  {
    title: 'Cal Poly AI Camp',
    subtitle: 'CSUCI Student Success Navigator',
    date: 'Cal Poly AI Camp',
    description:
      'Built a client-facing chatbot for CSU Channel Islands; 96% corpus faithfulness, 94% answer faithfulness across a 140-question eval set.',
    tags: ['React 19', 'Vite', 'AWS Lambda', 'Bedrock', 'API Gateway', 'CloudFront'],
    link: 'https://github.com/asherdrake/CSUCI-StudentSuccessNavigator',
    confetti: false,
  },
]
