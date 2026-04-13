import { useState, type FormEvent } from 'react'

import type { FeePayload, FeeResource } from '@/api/fee'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useCreateFee,
  useDeleteFee,
  useQueryFee,
  useUpdateFee,
} from '@/hooks/fee/use-fee-queries'
import { type ColumnDef } from '@tanstack/react-table'
import { BadgeDollarSign, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const initialFeeForm: FeePayload = {
  name: '',
  description: '',
  amount: 0,
  due_date: '',
  is_paid: false,
}

const feeColumns = (
  onEdit: (row: FeeResource) => void,
  onDelete: (id: number) => void
): ColumnDef<FeeResource>[] => [
  { accessorKey: 'name', header: 'Nama Iuran' },
  { accessorKey: 'description', header: 'Deskripsi' },
  {
    accessorKey: 'amount',
    header: 'Nominal',
    cell: ({ row }) => `Rp ${Number(row.original.amount).toLocaleString('id-ID')}`,
  },
  { accessorKey: 'due_date', header: 'Jatuh Tempo' },
  {
    accessorKey: 'is_paid',
    header: 'Status',
    cell: ({ row }) => (row.original.is_paid ? 'Lunas' : 'Belum Lunas'),
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

export default function FeePage() {
  const feeQuery = useQueryFee()
  const createFeeMutation = useCreateFee()
  const updateFeeMutation = useUpdateFee()
  const deleteFeeMutation = useDeleteFee()
  const [form, setForm] = useState<FeePayload>(initialFeeForm)
  const [editingFeeId, setEditingFeeId] = useState<number | null>(null)

  const rows = feeQuery.data?.rows ?? []

  const resetForm = () => {
    setForm(initialFeeForm)
    setEditingFeeId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (editingFeeId !== null) {
        await updateFeeMutation.mutateAsync({ id: editingFeeId, payload: form })
        toast.success('Iuran berhasil diperbarui.')
      } else {
        await createFeeMutation.mutateAsync(form)
        toast.success('Iuran berhasil ditambahkan.')
      }

      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan iuran.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteFeeMutation.mutateAsync(id)
      toast.success('Iuran berhasil dihapus.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus iuran.')
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card className="border-border/60 bg-background">
        <CardHeader>
          <CardTitle>{editingFeeId !== null ? 'Edit iuran' : 'Tambah iuran'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="fee-name">Nama iuran</Label>
              <Input
                id="fee-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee-description">Deskripsi</Label>
              <Input
                id="fee-description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee-amount">Nominal</Label>
              <Input
                id="fee-amount"
                type="number"
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, amount: Number(event.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee-date">Jatuh tempo</Label>
              <Input
                id="fee-date"
                type="date"
                value={form.due_date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, due_date: event.target.value }))
                }
              />
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={form.is_paid}
                onChange={(event) =>
                  setForm((current) => ({ ...current, is_paid: event.target.checked }))
                }
              />
              Sudah dibayar
            </label>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-[#102a43] text-white hover:bg-[#102a43]/90"
                disabled={createFeeMutation.isPending || updateFeeMutation.isPending}
              >
                <BadgeDollarSign />
                {editingFeeId !== null ? 'Update iuran' : 'Simpan iuran'}
              </Button>
              {editingFeeId !== null ? (
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
          <CardTitle>Daftar iuran</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={feeColumns(
              (row) => {
                setEditingFeeId(row.id)
                setForm({
                  name: row.name,
                  description: row.description,
                  amount: row.amount,
                  due_date: row.due_date,
                  is_paid: row.is_paid,
                })
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
