import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateResident } from '@/hooks/resident/use-create-resident'
import { useUploadResidentImage } from '@/hooks/resident/use-upload-resident-image'
import { residentSchema, residentStatuses, type ResidentFormValues } from '@/validations/resident'
import { ArrowLeft, ImageUp, LoaderCircle } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'

export default function CreateResidentPage() {
  const navigate = useNavigate()
  const createResidentMutation = useCreateResident()
  const uploadResidentImageMutation = useUploadResidentImage()
  const [uploadedFileName, setUploadedFileName] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResidentFormValues>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      name: '',
      ktp_image: '',
      status: 'tetap',
      no_telp: '',
      is_married: false,
    },
  })

  const uploadedImageUrl = watch('ktp_image')
  const ktpImageField = register('ktp_image')

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createResidentMutation.mutateAsync(values)
      toast.success('Resident berhasil ditambahkan.')
      navigate('/dashboard/penghuni')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menambahkan resident.')
    }
  })

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setUploadedFileName(file.name)

    try {
      const uploadedImageUrl = await uploadResidentImageMutation.mutateAsync({
        image: file,
      })

      setValue('ktp_image', uploadedImageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      })
      toast.success('Gambar KTP berhasil diupload.')
    } catch (error) {
      setValue('ktp_image', '', {
        shouldValidate: true,
        shouldDirty: true,
      })
      toast.error(error instanceof Error ? error.message : 'Gagal upload gambar KTP.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <Card className="border-border/60 bg-background">
      <CardHeader>
        <CardTitle>
          <div className="space-y-2">
            <Button variant="outline" className="w-fit" onClick={() => navigate(-1)}>
              <ArrowLeft />
              Kembali
            </Button>
            <div className="space-y-2">
              <h1 className="font-bold text-4xl">Create Resident</h1>
              <span className="font-light text-sm">Membuat resident baru</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Nama resident</Label>
            <Input id="name" placeholder="Budi Santoso" {...register('name')} />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="no_telp">No. telepon</Label>
            <Input id="no_telp" placeholder="081234567890" {...register('no_telp')} />
            {errors.no_telp ? (
              <p className="text-sm text-destructive">{errors.no_telp.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status resident</Label>
            <select
              id="status"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register('status')}
            >
              {residentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status ? (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="ktp_upload">Upload gambar KTP</Label>
            <label
              htmlFor="ktp_upload"
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-8 text-center transition-colors hover:border-[#102a43]/40 hover:bg-muted/50"
            >
              {uploadResidentImageMutation.isPending ? (
                <LoaderCircle className="size-6 animate-spin text-[#102a43]" />
              ) : (
                <ImageUp className="size-6 text-[#102a43]" />
              )}
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {uploadResidentImageMutation.isPending
                    ? 'Mengupload gambar KTP...'
                    : 'Klik untuk upload gambar KTP'}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, atau WEBP. File akan diupload lebih dulu sebelum submit form.
                </p>
              </div>
            </label>
            <input
              id="ktp_upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <input type="hidden" {...ktpImageField} />
            <Input
              readOnly
              value={uploadedImageUrl}
              placeholder="URL/path KTP akan terisi otomatis setelah upload"
            />
            {errors.ktp_image ? (
              <p className="text-sm text-destructive">{errors.ktp_image.message}</p>
            ) : null}
            {uploadedFileName ? (
              <p className="text-xs text-muted-foreground">File terpilih: {uploadedFileName}</p>
            ) : null}
          </div>

          <div className="md:col-span-2 rounded-2xl border border-border/60 bg-muted/30 p-4">
            <label className="flex items-center gap-3 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                className="size-4 rounded border border-input"
                {...register('is_married')}
              />
              Resident sudah menikah
            </label>
            {errors.is_married ? (
              <p className="mt-2 text-sm text-destructive">{errors.is_married.message}</p>
            ) : null}
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#102a43] text-white hover:bg-[#102a43]/90"
              disabled={createResidentMutation.isPending || uploadResidentImageMutation.isPending}
            >
              {createResidentMutation.isPending ? 'Menyimpan...' : 'Simpan resident'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
