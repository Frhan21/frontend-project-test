import { api } from '@/lib/axios'
import type { ApiResponse, PaginatedApiResponse } from '@/types/api-response'

export interface FeeResource {
  id: number
  name: string
  description: string
  amount: number
  due_date: string
  is_paid: boolean
  created_at?: string
  updated_at?: string
}

export interface FeePayload {
  name: string
  description: string
  amount: number
  due_date: string
  is_paid: boolean
}

export interface GetFeesParams {
  page?: number
}

export type FeesResponse = PaginatedApiResponse<FeeResource>
export type FeeResponse = ApiResponse<FeeResource>
export type FeeDeleteResponse = ApiResponse<null>

export const getFees = async (params?: GetFeesParams) => {
  try {
    const response = await api.get<FeesResponse>('/iuran', { params })
    return response.data
  } catch {
    throw new Error('Gagal mengambil data iuran.')
  }
}

export const getFeeById = async (id: number | string) => {
  try {
    const response = await api.get<FeeResponse>(`/iuran/${id}`)
    return response.data
  } catch {
    throw new Error('Gagal mengambil detail iuran.')
  }
}

export const createFee = async (payload: FeePayload) => {
  try {
    const response = await api.post<FeeResponse>('/iuran', payload)
    return response.data
  } catch {
    throw new Error('Gagal menambahkan iuran.')
  }
}

export const updateFee = async (id: number | string, payload: FeePayload) => {
  try {
    const response = await api.put<FeeResponse>(`/iuran/${id}`, payload)
    return response.data
  } catch {
    throw new Error('Gagal memperbarui iuran.')
  }
}

export const deleteFee = async (id: number | string) => {
  try {
    const response = await api.delete<FeeDeleteResponse>(`/iuran/${id}`)
    return response.data
  } catch {
    throw new Error('Gagal menghapus iuran.')
  }
}
