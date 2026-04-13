import { z } from 'zod'

export const residentStatuses = ['tetap', 'kontrak'] as const

export const residentSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama resident minimal 3 karakter.')
    .max(100, 'Nama resident maksimal 100 karakter.'),
  ktp_image: z
    .string()
    .min(3, 'Path KTP wajib diisi.')
    .max(255, 'Path KTP terlalu panjang.'),
  status: z.enum(residentStatuses, {
    message: 'Status resident wajib dipilih.',
  }),
  no_telp: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit.')
    .max(20, 'Nomor telepon maksimal 20 digit.')
    .regex(/^[0-9+]+$/, 'Nomor telepon hanya boleh berisi angka atau tanda +.'),
  is_married: z.boolean(),
})

export type ResidentFormValues = z.infer<typeof residentSchema>
