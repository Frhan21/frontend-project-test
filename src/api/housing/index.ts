import { api } from '@/lib/axios'
import type { ApiResponse, PaginatedApiResponse } from '@/types/api-response'

export interface HousingResource {
  id: number
  resident_id: string
  house_id: string
  resident?: {
    id: number | string
    name: string
  }
  house?: {
    id: number | string
    name: string
  }
  start_date: string
  end_date: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface HousingPayload {
  resident_id: string
  house_id: string
  start_date: string
  end_date: string
  is_active: boolean
}

export interface GetHousingParams {
  page?: number
}

export type HousingResponse = PaginatedApiResponse<HousingResource>
export type HousingItemResponse = ApiResponse<HousingResource>
export type HousingDeleteResponse = ApiResponse<null>

export const getHousing = async (params?: GetHousingParams) => {
  try {
    const response = await api.get<HousingResponse>('/hunian', { params })
    return response.data
  } catch {
    throw new Error('Gagal mengambil data hunian.')
  }
}

export const getHousingById = async (id: number | string) => {
  try {
    const response = await api.get<HousingItemResponse>(`/hunian/${id}`)
    return response.data
  } catch {
    throw new Error('Gagal mengambil detail hunian.')
  }
}

export const createHousing = async (payload: HousingPayload) => {
  try {
    const response = await api.post<HousingItemResponse>('/hunian', payload)
    return response.data
  } catch {
    throw new Error('Gagal menambahkan hunian.')
  }
}

export const updateHousing = async (id: number | string, payload: HousingPayload) => {
  try {
    const response = await api.put<HousingItemResponse>(`/hunian/${id}`, payload)
    return response.data
  } catch {
    throw new Error('Gagal memperbarui hunian.')
  }
}

export const deleteHousing = async (id: number | string) => {
  try {
    const response = await api.delete<HousingDeleteResponse>(`/hunian/${id}`)
    return response.data
  } catch {
    throw new Error('Gagal menghapus hunian.')
  }
}
