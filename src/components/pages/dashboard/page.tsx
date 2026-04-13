import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useQueryCategory } from '@/hooks/category/use-query-category'
import { useQueryFee } from '@/hooks/fee/use-fee-queries'
import { useQueryHouse } from '@/hooks/house/use-house-queries'
import { useQueryHousing } from '@/hooks/housing/use-housing-queries'
import { useQueryOutcome } from '@/hooks/outcome/use-outcome-queries'
import { useQueryResident } from '@/hooks/resident/use-query-resident'
import { useSession } from '@/providers/session-provider'
import {
  BanknoteArrowDown,
  House,
  LayoutGrid,
  ReceiptText,
  UsersRound,
} from 'lucide-react'

const RootDashboard = () => {
  const { user } = useSession()
  const residentQuery = useQueryResident()
  const categoryQuery = useQueryCategory()
  const houseQuery = useQueryHouse()
  const housingQuery = useQueryHousing()
  const feeQuery = useQueryFee()
  const outcomeQuery = useQueryOutcome()

  const summaryCards = [
    {
      label: 'Residents',
      value: residentQuery.data?.meta?.total ?? 0,
      icon: UsersRound,
    },
    {
      label: 'Categories',
      value: categoryQuery.data?.meta?.total ?? 0,
      icon: LayoutGrid,
    },
    {
      label: 'Houses',
      value: houseQuery.data?.meta?.total ?? 0,
      icon: House,
    },
    {
      label: 'Housing',
      value: housingQuery.data?.meta?.total ?? 0,
      icon: House,
    },
    {
      label: 'Fees',
      value: feeQuery.data?.meta?.total ?? 0,
      icon: ReceiptText,
    },
    {
      label: 'Outcomes',
      value: outcomeQuery.data?.meta?.total ?? 0,
      icon: BanknoteArrowDown,
    },
  ]

  return (
    <div className="space-y-6">
      <section>
        <Card className="overflow-hidden border-border/60 bg-[#fffaf0] py-0">
          <CardContent className="px-6 py-8 lg:px-8">
            <div className="space-y-4">
              <Badge variant="outline" className="bg-white/70">
                Dashboard overview
              </Badge>
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                  Selamat datang kembali, {user?.name}.
                </h2>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground lg:text-base">
                  Kamu sekarang punya baseline dashboard internal dengan auth
                  flow, guard public/protected route, dan provider yang siap
                  dilanjutkan ke API real, data fetching, serta feature module
                  berikutnya.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border/60 bg-background">
            <CardContent className="space-y-4 px-5 py-5">
              <div className="inline-flex rounded-2xl bg-muted p-3">
                <Icon className="size-5 text-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{label}</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight">
                  {value}
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">Data aktif yang berhasil dimuat dari endpoint terkait.</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}

export default RootDashboard
