import { useState, type FormEvent } from 'react'

import type { HouseResource } from '@/api/house'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useCreateHouse,
  useDeleteHouse,
  useQueryHouse,
  useUpdateHouse,
} from '@/hooks/house/use-house-queries'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const houseColumns = (
  onEdit: (row: HouseResource) => void,
  onDelete: (id: number) => void
): ColumnDef<HouseResource>[] => [
  { accessorKey: 'name', header: 'Nama Rumah' },
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

export default function HousePage() {
  const houseQuery = useQueryHouse()
  const createHouseMutation = useCreateHouse()
  const updateHouseMutation = useUpdateHouse()
  const deleteHouseMutation = useDeleteHouse()
  const [name, setName] = useState('')
  const [editingHouseId, setEditingHouseId] = useState<number | null>(null)

  const rows = houseQuery.data?.rows ?? []
  const meta = houseQuery.data?.meta

  const resetForm = () => {
    setEditingHouseId(null)
    setName('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (editingHouseId !== null) {
        await updateHouseMutation.mutateAsync({ id: editingHouseId, payload: { name } })
        toast.success('Rumah berhasil diperbarui.')
      } else {
        await createHouseMutation.mutateAsync({ name })
        toast.success('Rumah berhasil ditambahkan.')
      }

      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan rumah.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteHouseMutation.mutateAsync(id)
      toast.success('Rumah berhasil dihapus.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus rumah.')
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card className="border-border/60 bg-background">
        <CardHeader>
          <CardTitle>{editingHouseId !== null ? 'Edit rumah' : 'Tambah rumah'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="house-name">Nama rumah</Label>
              <Input
                id="house-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Contoh: Blok A-12"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-[#102a43] text-white hover:bg-[#102a43]/90"
                disabled={createHouseMutation.isPending || updateHouseMutation.isPending}
              >
                <PlusCircle />
                {editingHouseId !== null ? 'Update rumah' : 'Simpan rumah'}
              </Button>
              {editingHouseId !== null ? (
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
          <CardTitle>Daftar rumah</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-muted/40 p-4 text-sm text-muted-foreground">
            Total rumah: <span className="font-medium text-foreground">{meta?.total ?? 0}</span>
          </div>
          <DataTable
            columns={houseColumns(
              (row) => {
                setEditingHouseId(row.id)
                setName(row.name)
              },
              handleDelete
            )}
            data={rows}
          />
        </CardContent>
      </Card>
    </div>
  )
}
