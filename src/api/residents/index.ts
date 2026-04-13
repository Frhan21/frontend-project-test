import { api } from '@/lib/axios'
import axios from 'axios'
import type {
  ApiResponse,
  PaginatedApiResponse,
} from '@/types/api-response'
import type { ResidentFormValues } from '@/validations/resident'

export type ResidentStatus = 'tetap' | 'kontrak' | 'sementara' | string

export interface ResidentResource {
  id: number
  name: string
  ktp_image: string
  status: ResidentStatus
  no_telp: string
  is_married: boolean | 0 | 1
  created_at: string
  updated_at: string
}

export interface GetResidentsParams {
  page?: number
}

export interface ImageUpload {
  image: File
}

export interface ImageUploadResource {
  public_id: string
  url: string
  original_filename: string
  width: number
  height: number
  format: string
}

export type CreateResidentPayload = ResidentFormValues

export type GetResidentsResponse = PaginatedApiResponse<ResidentResource>

export type CreateResidentResponse = ApiResponse<ResidentResource>

export type ImageUploadResponse = ApiResponse<ImageUploadResource>

function getUploadedImageUrl(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const response = payload as Record<string, unknown>
  const nestedData =
    response.data && typeof response.data === 'object'
      ? (response.data as Record<string, unknown>)
      : null

  if (typeof nestedData?.url === 'string') {
    return nestedData.url
  }

  if (typeof response.url === 'string') {
    return response.url
  }

  return null
}

export const getResidents = async (params?: GetResidentsParams) => {
  try {
    const response = await api.get<GetResidentsResponse>('/penghuni', {
      params,
    })

    return response.data
  } catch {
    throw new Error('Gagal mengambil data penghuni.')
  }
}

export const createResident = async (payload: CreateResidentPayload) => {
  try {
    const response = await api.post<CreateResidentResponse>('/penghuni', payload)

    return response.data
  } catch {
    throw new Error('Gagal menambahkan data penghuni.')
  }
}

export const uploadImageResident = async ({ image }: ImageUpload) => {
  try {
    const formData = new FormData()
    formData.append('ktp_image', image)

    const response = await api.post<ImageUploadResponse | ImageUploadResource>('/penghuni/upload-ktp', formData)

    const uploadedImageUrl = getUploadedImageUrl(response.data)

    if (!uploadedImageUrl) {
      throw new Error('URL gambar KTP tidak ditemukan pada response upload.')
    }

    return uploadedImageUrl
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.response?.status === 422
            ? 'Upload KTP gagal. Pastikan file dipilih pada field yang benar dan formatnya valid.'
            : null

      throw new Error(message || 'Gagal mengupload gambar KTP.')
    }

    throw new Error('Gagal mengupload gambar KTP.')
  }
}
