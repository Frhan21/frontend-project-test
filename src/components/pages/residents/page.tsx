import type { ResidentResource } from '@/api/residents'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { useQueryResident } from '@/hooks/resident/use-query-resident'
import { cn } from '@/lib/utils'
import { type ColumnDef } from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router'

const statusTone: Record<string, string> = {
  tetap: 'bg-emerald-100 text-emerald-800',
  kontrak: 'bg-amber-100 text-amber-800',
  sementara: 'bg-slate-200 text-slate-800',
}

const residentColumns: ColumnDef<ResidentResource>[] = [
  {
    accessorKey: 'name',
    header: 'Nama',
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'no_telp',
    header: 'No. Telepon',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        className={cn(
          'capitalize',
          statusTone[row.original.status] ?? 'bg-slate-100 text-slate-700'
        )}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'is_married',
    header: 'Menikah',
    cell: ({ row }) => (row.original.is_married ? 'Sudah' : 'Belum'),
  },
  {
    accessorKey: 'ktp_image',
    header: 'KTP',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.ktp_image}</span>
    ),
  },
]

export const Resident = () => {
  const navigate = useNavigate()
  const residentQuery = useQueryResident()

  const residents = residentQuery.data?.rows ?? []
  const meta = residentQuery.data?.meta

  return (
    <Card className="border-border/60 bg-background">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            <div className="space-y-2">
              <h1 className="font-bold text-4xl">Daftar Resident</h1>
              <span className="font-light text-sm">
                Daftar penduduk yang ada di lingkungan RT ini
              </span>
            </div>

            <Button
              onClick={() => navigate('/dashboard/penghuni/create')}
              className="bg-[#102a43] px-4 py-6 text-center text-white transition-colors hover:bg-[#102a43]/90 hover:shadow-md"
            >
              <PlusCircle />
              Tambah Resident
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
          <div>
            <div className="font-medium text-foreground">Total resident</div>
            <div className="text-sm text-muted-foreground">
              {meta?.total ?? 0} data tercatat
            </div>
          </div>
          {residentQuery.isLoading ? (
            <div>Memuat data...</div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Page {meta?.current_page ?? 1} dari {meta?.last_page ?? 1}
            </div>
          )}
        </div>

        {residentQuery.isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            {residentQuery.error instanceof Error
              ? residentQuery.error.message
              : 'Gagal memuat data resident.'}
          </div>
        ) : null}
        <DataTable columns={residentColumns} data={residents} />
      </CardContent>
    </Card>
  )
}
