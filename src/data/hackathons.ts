import devLensThumb from '../assets/projects/DevLensAi.png'
import cloudathonPhoto from '../assets/hackathons/Cloudathon.jpeg'
import xtracePhoto from '../assets/hackathons/Xtrace.jpeg'
import nvidiaGtcPhoto from '../assets/hackathons/NvidiaGTC.jpeg'
import awsSummerCampPhoto from '../assets/hackathons/AWS_SummerCamp.jpeg'
import awsLoftPhoto from '../assets/hackathons/AWS_Loft.jpeg'

export type HackathonSize = 'large' | 'wideTop' | 'square' | 'wideBottom'

export interface HackathonEntry {
  title: string
  subtitle?: string
  badge?: string
  date: string
  description: string
  tags: string[]
  link?: string
  image?: string
  icon?: string
  size: HackathonSize
  confetti?: boolean
  showBadgeOnCard?: boolean
}

export const HACKATHONS: HackathonEntry[] = [
  {
    title: 'SJSU AWS Cloudathon',
    badge: '🏆 2nd Place · 300+ Participants',
    date: 'May 2026',
    description:
      'Secured AWS infrastructure across 14 challenges in 4 hours: CloudFront + ALB origin protection, RDS/S3 encryption, Lambda/Systems Manager automation; diagnosed and restored failed services under time pressure (security group misconfigurations, IAM policy violations, EC2 metadata issues).',
    tags: ['CloudFront', 'ALB', 'RDS', 'S3', 'Lambda', 'Systems Manager', 'IAM', 'EC2'],
    image: cloudathonPhoto,
    size: 'large',
    confetti: true,
    showBadgeOnCard: true,
  },
  {
    title: 'Xtrace Agent Memory Hackathon',
    subtitle: 'OneTable',
    badge: '🏆 Winner',
    date: 'Xtrace Agent Memory Hackathon',
    description:
      "Agent/backend lead on OneTable, a memory-powered group dining agent — recalls each diner's constraints, negotiates a group order, reacts to membership/preference changes mid-session, and writes checkout outcomes back to memory.",
    tags: ['Next.js', 'TypeScript', 'Agent Memory'],
    link: 'https://github.com/itsRenuka22/OneTable',
    image: xtracePhoto,
    size: 'wideTop',
    confetti: true,
    showBadgeOnCard: true,
  },
  {
    title: 'DevLens',
    subtitle: 'Sprint Mirror · Google Cloud Rapid Agent Hackathon',
    badge: 'Fivetran Track · Team of 3',
    date: 'Google Cloud Rapid Agent Hackathon',
    description: 'Unified dev signals from GitHub, Jira, and Calendar into a live Cloud Run dashboard.',
    tags: ['Cloud Run', 'Google ADK', 'MCP'],
    link: 'https://github.com/itsRenuka22/DevLens',
    image: devLensThumb,
    size: 'square',
  },
  {
    title: 'PaperGap',
    subtitle: 'NVIDIA GTC Hackathon',
    date: 'NVIDIA GTC Agents for Impact Hackathon',
    description: 'Nemotron-powered agent surfacing top research gaps across 250M+ papers.',
    tags: ['NVIDIA Nemotron', 'Multi-Agent'],
    link: 'https://github.com/itsRenuka22/nvda-nemotron-agent',
    image: nvidiaGtcPhoto,
    size: 'square',
  },
  {
    title: 'CSUCI Student Success Navigator',
    subtitle: 'Cal Poly AI Camp',
    badge: "SJSU's Largest CSU Contingent",
    date: 'Cal Poly AI Camp',
    description:
      'Built a client-facing RAG chatbot for CSU Channel Islands in one week: 96% corpus faithfulness, 94% answer faithfulness across a 140-question eval set.',
    tags: ['React 19', 'AWS Lambda', 'Bedrock', 'API Gateway', 'CloudFront'],
    link: 'https://github.com/itsRenuka22/CSUCI-StudentSuccessNavigator',
    image: awsSummerCampPhoto,
    size: 'wideBottom',
  },
  {
    title: 'Startup-Radar',
    subtitle: 'AWS Loft',
    date: 'AWS Loft',
    description: 'Built at an AWS Loft hackathon.',
    tags: ['AWS'],
    link: 'https://github.com/itsRenuka22/Startup-Radar',
    image: awsLoftPhoto,
    size: 'square',
  },
]
