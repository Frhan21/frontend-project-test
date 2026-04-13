import { useState, type FormEvent } from 'react'

import type { CategoryResource } from '@/api/category'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateCategory } from '@/hooks/category/use-create-category'
import { useDeleteCategory } from '@/hooks/category/use-delete-category'
import { useQueryCategory } from '@/hooks/category/use-query-category'
import { useUpdateCategory } from '@/hooks/category/use-update-category'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const categoryColumns = (
  onEdit: (row: CategoryResource) => void,
  onDelete: (id: number) => void
): ColumnDef<CategoryResource>[] => [
  { accessorKey: 'name', header: 'Nama Kategori' },
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

export default function CategoryPage() {
  const categoryQuery = useQueryCategory()
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const deleteCategoryMutation = useDeleteCategory()
  const [name, setName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)

  const rows = categoryQuery.data?.rows ?? []
  const meta = categoryQuery.data?.meta

  const resetForm = () => {
    setName('')
    setEditingCategoryId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (editingCategoryId !== null) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategoryId,
          payload: { name },
        })
        toast.success('Kategori berhasil diperbarui.')
      } else {
        await createCategoryMutation.mutateAsync({ name })
        toast.success('Kategori berhasil ditambahkan.')
      }

      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan kategori.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteCategoryMutation.mutateAsync(id)
      toast.success('Kategori berhasil dihapus.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus kategori.')
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card className="border-border/60 bg-background">
        <CardHeader>
          <CardTitle>{editingCategoryId !== null ? 'Edit kategori' : 'Tambah kategori'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="category-name">Nama kategori</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Contoh: Kebersihan"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-[#102a43] text-white hover:bg-[#102a43]/90"
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                <PlusCircle />
                {editingCategoryId !== null ? 'Update kategori' : 'Simpan kategori'}
              </Button>
              {editingCategoryId !== null ? (
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
          <CardTitle>Daftar kategori</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-muted/40 p-4 text-sm text-muted-foreground">
            Total kategori: <span className="font-medium text-foreground">{meta?.total ?? 0}</span>
          </div>
          <DataTable
            columns={categoryColumns(
              (row) => {
                setEditingCategoryId(row.id)
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
