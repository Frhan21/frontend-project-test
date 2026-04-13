import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSession } from '@/providers/session-provider'
import {
  Activity,
  ArrowUpRight,
  FolderKanban,
  Layers3,
  ServerCog,
  UsersRound,
} from 'lucide-react'

const metrics = [
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

const activities = [
  { team: 'Platform', task: 'Refresh auth middleware', status: 'In Review', owner: 'Alya' },
  { team: 'CRM', task: 'Launch register onboarding', status: 'Ready', owner: 'Rizky' },
  { team: 'Infra', task: 'Audit staging endpoints', status: 'Blocked', owner: 'Nadia' },
  { team: 'Growth', task: 'Revamp dashboard widgets', status: 'In Progress', owner: 'Fikri' },
]

export default function App() {
  const { user } = useSession()

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="overflow-hidden border-border/60 bg-[#fffaf0] py-0">
          <CardContent className="grid gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="space-y-4">
              <Badge variant="outline" className="bg-white/70">
                Dashboard overview
              </Badge>
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                  Selamat datang kembali, {user?.name}.
                </h2>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground lg:text-base">
                  Kamu sekarang punya baseline dashboard internal dengan auth flow,
                  guard public/protected route, dan provider yang siap dilanjutkan ke
                  API real, data fetching, serta feature module berikutnya.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg">
                  Review deployment plan
                  <ArrowUpRight className="size-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Open analytics report
                </Button>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#102a43] p-6 text-white shadow-inner">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <Activity className="size-5 text-[#f1c27d]" />
                </div>
                <div>
                  <div className="text-sm text-white/70">System pulse</div>
                  <div className="text-lg font-semibold">Frontend readiness</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="text-sm text-white/70">Auth routing</div>
                  <div className="mt-1 text-2xl font-semibold">Healthy</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="text-sm text-white/70">Provider stack</div>
                  <div className="mt-1 text-2xl font-semibold">Centralized</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="text-sm text-white/70">Design system usage</div>
                  <div className="mt-1 text-2xl font-semibold">Ready to extend</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background">
          <CardHeader>
            <CardTitle>Weekly focus</CardTitle>
            <CardDescription>
              Checklist ringkas untuk langkah pengembangan berikutnya.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Hubungkan login dan register ke API backend',
              'Tambahkan token refresh dan interceptor axios',
              'Pisahkan module dashboard per domain bisnis',
              'Pasang error boundary dan loading states per route',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-border/60 bg-muted/35 p-4 text-sm">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, description, icon: Icon, tone }) => (
          <Card key={label} className="border-border/60 bg-background">
            <CardContent className="space-y-4 px-5 py-5">
              <div className={`inline-flex rounded-2xl p-3 ${tone}`}>
                <Icon className="size-5 text-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{label}</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-border/60 bg-background">
        <CardHeader>
          <CardTitle>Recent team activity</CardTitle>
          <CardDescription>
            Snapshot ringan untuk operasional harian tim internal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={`${activity.team}-${activity.task}`}>
                  <TableCell className="font-medium">{activity.team}</TableCell>
                  <TableCell>{activity.task}</TableCell>
                  <TableCell>{activity.status}</TableCell>
                  <TableCell>{activity.owner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
