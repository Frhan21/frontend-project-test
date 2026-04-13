import { api } from '@/lib/axios'
import type { ApiResponse, PaginatedApiResponse } from '@/types/api-response'

export interface OutcomeResource {
  id: number
  description: string
  total: number
  outcome_date: string
  category_id: string
  created_at?: string
  updated_at?: string
}

export interface OutcomePayload {
  description: string
  total: number
  outcome_date: string
  category_id: string
}

export interface GetOutcomeParams {
  page?: number
}

export type OutcomeResponse = PaginatedApiResponse<OutcomeResource>
export type OutcomeItemResponse = ApiResponse<OutcomeResource>
export type OutcomeDeleteResponse = ApiResponse<null>

export const getOutcomes = async (params?: GetOutcomeParams) => {
  try {
    const response = await api.get<OutcomeResponse>('/pengeluaran', { params })
    return response.data
  } catch {
    throw new Error('Gagal mengambil data pengeluaran.')
  }
}

export const getOutcomeById = async (id: number | string) => {
  try {
    const response = await api.get<OutcomeItemResponse>(`/pengeluaran/${id}`)
    return response.data
  } catch {
    throw new Error('Gagal mengambil detail pengeluaran.')
  }
}

export const createOutcome = async (payload: OutcomePayload) => {
  try {
    const response = await api.post<OutcomeItemResponse>('/pengeluaran', payload)
    return response.data
  } catch {
    throw new Error('Gagal menambahkan pengeluaran.')
  }
}

export const updateOutcome = async (id: number | string, payload: OutcomePayload) => {
  try {
    const response = await api.put<OutcomeItemResponse>(`/pengeluaran/${id}`, payload)
    return response.data
  } catch {
    throw new Error('Gagal memperbarui pengeluaran.')
  }
}

export const deleteOutcome = async (id: number | string) => {
  try {
    const response = await api.delete<OutcomeDeleteResponse>(`/pengeluaran/${id}`)
    return response.data
  } catch {
    throw new Error('Gagal menghapus pengeluaran.')
  }
}
