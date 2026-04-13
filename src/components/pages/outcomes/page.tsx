import { useState, type FormEvent } from 'react'

import type { OutcomePayload, OutcomeResource } from '@/api/outcome'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQueryCategory } from '@/hooks/category/use-query-category'
import {
  useCreateOutcome,
  useDeleteOutcome,
  useQueryOutcome,
  useUpdateOutcome,
} from '@/hooks/outcome/use-outcome-queries'
import { type ColumnDef } from '@tanstack/react-table'
import { BanknoteArrowDown, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const initialOutcomeForm: OutcomePayload = {
  description: '',
  total: 0,
  outcome_date: '',
  category_id: '',
}

const outcomeColumns = (
  onEdit: (row: OutcomeResource) => void,
  onDelete: (id: number) => void
): ColumnDef<OutcomeResource>[] => [
  { accessorKey: 'description', header: 'Deskripsi' },
  {
    accessorKey: 'total',
    header: 'Nominal',
    cell: ({ row }) => `Rp ${Number(row.original.total).toLocaleString('id-ID')}`,
  },
  { accessorKey: 'outcome_date', header: 'Tanggal' },
  { accessorKey: 'category_id', header: 'Kategori ID' },
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

export default function OutcomePage() {
  const outcomeQuery = useQueryOutcome()
  const categoryQuery = useQueryCategory()
  const createOutcomeMutation = useCreateOutcome()
  const updateOutcomeMutation = useUpdateOutcome()
  const deleteOutcomeMutation = useDeleteOutcome()
  const [form, setForm] = useState<OutcomePayload>(initialOutcomeForm)
  const [editingOutcomeId, setEditingOutcomeId] = useState<number | null>(null)

  const categoryOptions = categoryQuery.data?.rows ?? []

  const resetForm = () => {
    setForm(initialOutcomeForm)
    setEditingOutcomeId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (editingOutcomeId !== null) {
        await updateOutcomeMutation.mutateAsync({ id: editingOutcomeId, payload: form })
        toast.success('Pengeluaran berhasil diperbarui.')
      } else {
        await createOutcomeMutation.mutateAsync(form)
        toast.success('Pengeluaran berhasil ditambahkan.')
      }

      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan pengeluaran.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteOutcomeMutation.mutateAsync(id)
      toast.success('Pengeluaran berhasil dihapus.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus pengeluaran.')
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card className="border-border/60 bg-background">
        <CardHeader>
          <CardTitle>{editingOutcomeId !== null ? 'Edit pengeluaran' : 'Tambah pengeluaran'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="outcome-description">Deskripsi</Label>
              <Input
                id="outcome-description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outcome-total">Nominal</Label>
              <Input
                id="outcome-total"
                type="number"
                value={form.total}
                onChange={(event) =>
                  setForm((current) => ({ ...current, total: Number(event.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outcome-date">Tanggal pengeluaran</Label>
              <Input
                id="outcome-date"
                type="date"
                value={form.outcome_date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, outcome_date: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outcome-category">Kategori</Label>
              <select
                id="outcome-category"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                value={form.category_id}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category_id: event.target.value }))
                }
              >
                <option value="">Pilih kategori</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-[#102a43] text-white hover:bg-[#102a43]/90"
                disabled={createOutcomeMutation.isPending || updateOutcomeMutation.isPending}
              >
                <BanknoteArrowDown />
                {editingOutcomeId !== null ? 'Update pengeluaran' : 'Simpan pengeluaran'}
              </Button>
              {editingOutcomeId !== null ? (
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
          <CardTitle>Daftar pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={outcomeColumns(
              (row) => {
                setEditingOutcomeId(row.id)
                setForm({
                  description: row.description,
                  total: row.total,
                  outcome_date: row.outcome_date,
                  category_id: row.category_id,
                })
              },
              handleDelete
            )}
            data={outcomeQuery.data?.rows ?? []}
          />
        </CardContent>
      </Card>
    </div>
  )
}
