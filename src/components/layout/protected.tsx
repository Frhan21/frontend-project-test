import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSession } from '@/providers/session-provider'
import {
  BanknoteArrowDown,
  Bell,
  Home,
  LayoutGrid,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Users
} from 'lucide-react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router'
import { Toaster } from '../ui/sonner'

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/penghuni', label: 'Residents', icon: Users },
  { to: '/dashboard/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/dashboard/houses', label: 'Houses', icon: Home },
  { to: '/dashboard/housing', label: 'Housing', icon: Home },
  { to: '/dashboard/fees', label: 'Fees', icon: ReceiptText },
  { to: '/dashboard/outcomes', label: 'Outcomes', icon: BanknoteArrowDown },
  { to: '/dashboard/payments', label: 'Payments', icon: ReceiptText },
]

export default function ProtectedLayout() {
  const location = useLocation()
  const { isAuthenticated, logout, user } = useSession()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-border/60 bg-[#102a43] px-6 py-8 text-white">
          <div className="mb-10">
            <Badge className="mb-4 bg-white/10 text-white hover:bg-white/10">
              Dev Workspace
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight">Admin Panel</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Monitoring, operasi tim, dan akses cepat untuk area internal.
            </p>
          </div>

          <nav className="space-y-2">
            {navigationItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-white text-[#102a43] shadow-sm'
                      : 'text-white/72 hover:bg-white/10 hover:text-white'
                  )
                }
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl border border-white/12 bg-white/6 p-4">
            <div className="text-sm font-medium text-white">{user?.name}</div>
            <div className="mt-1 text-sm text-white/65">{user?.email}</div>
            <div className="mt-4">
              <Button
                variant="secondary"
                className="w-full justify-center bg-white text-[#102a43] hover:bg-white/90"
                onClick={logout}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-border/60 bg-[#fffdf8]/85 px-6 py-5 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Protected area</p>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Operasional frontend dashboard
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-2xl border border-border/60 bg-background px-4 py-2 text-sm text-muted-foreground md:block">
                  Signed in as <span className="font-medium text-foreground">{user?.role}</span>
                </div>
                <button className="rounded-2xl border border-border/60 bg-background p-2.5 text-muted-foreground transition-colors hover:text-foreground">
                  <Bell className="size-4" />
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
          <Toaster/> 
        </div>
      </div>
    </div>
  )
}
