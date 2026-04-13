import { useState, type FormEvent } from 'react'

import type { HousingPayload, HousingResource } from '@/api/housing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQueryHouse } from '@/hooks/house/use-house-queries'
import {
  useCreateHousing,
  useDeleteHousing,
  useQueryHousing,
  useUpdateHousing,
} from '@/hooks/housing/use-housing-queries'
import { useQueryResident } from '@/hooks/resident/use-query-resident'
import { type ColumnDef } from '@tanstack/react-table'
import { Home, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const initialHousingForm: HousingPayload = {
  resident_id: '',
  house_id: '',
  start_date: '',
  end_date: '',
  is_active: true,
}

const housingColumns = (
  residentNames: Record<string, string>,
  houseNames: Record<string, string>,
  onEdit: (row: HousingResource) => void,
  onDelete: (id: number) => void
): ColumnDef<HousingResource>[] => [
  {
    accessorKey: 'resident_id',
    header: 'Resident',
    cell: ({ row }) =>
      row.original.resident?.name ||
      residentNames[String(row.original.resident_id)] ||
      row.original.resident_id,
  },
  {
    accessorKey: 'house_id',
    header: 'House',
    cell: ({ row }) =>
      row.original.house?.name || houseNames[String(row.original.house_id)] || row.original.house_id,
  },
  { accessorKey: 'start_date', header: 'Mulai' },
  { accessorKey: 'end_date', header: 'Selesai' },
  {
    accessorKey: 'is_active',
    header: 'Aktif',
    cell: ({ row }) => (row.original.is_active ? 'Ya' : 'Tidak'),
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => onEdit(row.original)}>
          <Pencil />
          Edit
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onDelete(row.original.id)}
        >
          <Trash2 />
          Hapus
        </Button>
      </div>
    ),
  },
]

export default function HousingPage() {
  const housingQuery = useQueryHousing()
  const residentQuery = useQueryResident()
  const houseQuery = useQueryHouse()
  const createHousingMutation = useCreateHousing()
  const updateHousingMutation = useUpdateHousing()
  const deleteHousingMutation = useDeleteHousing()
  const [form, setForm] = useState<HousingPayload>(initialHousingForm)
  const [editingHousingId, setEditingHousingId] = useState<number | null>(null)

  const residentOptions = residentQuery.data?.rows ?? []
  const houseOptions = houseQuery.data?.rows ?? []
  const residentNames = Object.fromEntries(
    residentOptions.map((resident) => [String(resident.id), resident.name])
  )
  const houseNames = Object.fromEntries(houseOptions.map((house) => [String(house.id), house.name]))

  const resetForm = () => {
    setForm(initialHousingForm)
    setEditingHousingId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (editingHousingId !== null) {
        await updateHousingMutation.mutateAsync({ id: editingHousingId, payload: form })
        toast.success('Hunian berhasil diperbarui.')
      } else {
        await createHousingMutation.mutateAsync(form)
        toast.success('Hunian berhasil ditambahkan.')
      }

      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan hunian.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteHousingMutation.mutateAsync(id)
      toast.success('Hunian berhasil dihapus.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus hunian.')
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card className="border-border/60 bg-background">
        <CardHeader>
          <CardTitle>{editingHousingId !== null ? 'Edit hunian' : 'Tambah hunian'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="resident-id">Resident</Label>
              <select
                id="resident-id"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                value={form.resident_id}
                onChange={(event) =>
                  setForm((current) => ({ ...current, resident_id: event.target.value }))
                }
              >
                <option value="">Pilih resident</option>
                {residentOptions.map((resident) => (
                  <option key={resident.id} value={String(resident.id)}>
                    {resident.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="house-id">Rumah</Label>
              <select
                id="house-id"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                value={form.house_id}
                onChange={(event) =>
                  setForm((current) => ({ ...current, house_id: event.target.value }))
                }
              >
                <option value="">Pilih rumah</option>
                {houseOptions.map((house) => (
                  <option key={house.id} value={String(house.id)}>
                    {house.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Tanggal mulai</Label>
              <Input
                id="start-date"
                type="date"
                value={form.start_date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, start_date: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Tanggal selesai</Label>
              <Input
                id="end-date"
                type="date"
                value={form.end_date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, end_date: event.target.value }))
                }
              />
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  setForm((current) => ({ ...current, is_active: event.target.checked }))
                }
              />
              Hunian aktif
            </label>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-[#102a43] text-white hover:bg-[#102a43]/90"
                disabled={createHousingMutation.isPending || updateHousingMutation.isPending}
              >
                <Home />
                {editingHousingId !== null ? 'Update hunian' : 'Simpan hunian'}
              </Button>
              {editingHousingId !== null ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-background">
        <CardHeader>
          <CardTitle>Daftar hunian</CardTitle>
        </CardHeader>
        <CardContent>
            <DataTable
              columns={housingColumns(
                residentNames,
                houseNames,
                (row) => {
                  setEditingHousingId(row.id)
                  setForm({
                    resident_id: row.resident_id,
                    house_id: row.house_id,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    is_active: row.is_active,
                  })
                },
                handleDelete
              )}
              data={housingQuery.data?.rows ?? []}
          />
        </CardContent>
      </Card>
    </div>
  )
}
