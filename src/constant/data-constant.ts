import { FolderKanban, Layers3, ServerCog, UsersRound } from "lucide-react"

export const metrics = [
  {
    label: 'Active projects',
    value: '12',
    description: '3 project baru masuk review minggu ini.',
    icon: FolderKanban,
    tone: 'bg-[#f4efe4]',
  },
  {
    label: 'API health',
    value: '99.92%',
    description: 'Latency stabil di bawah 220ms.',
    icon: ServerCog,
    tone: 'bg-[#e5f4eb]',
  },
  {
    label: 'Team utilization',
    value: '84%',
    description: 'Sisa kapasitas tim cukup untuk sprint berikutnya.',
    icon: UsersRound,
    tone: 'bg-[#e9eefb]',
  },
  {
    label: 'Open initiatives',
    value: '7',
    description: 'Fokus utama: auth flow, observability, CMS.',
    icon: Layers3,
    tone: 'bg-[#f9e8e8]',
  },
]

export const activities = [
  { team: 'Platform', task: 'Refresh auth middleware', status: 'In Review', owner: 'Alya' },
  { team: 'CRM', task: 'Launch register onboarding', status: 'Ready', owner: 'Rizky' },
  { team: 'Infra', task: 'Audit staging endpoints', status: 'Blocked', owner: 'Nadia' },
  { team: 'Growth', task: 'Revamp dashboard widgets', status: 'In Progress', owner: 'Fikri' },
]