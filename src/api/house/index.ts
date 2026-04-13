import { api } from '@/lib/axios'
import type { ApiResponse, PaginatedApiResponse } from '@/types/api-response'

export interface HouseResource {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export interface HousePayload {
  name: string
}

export interface GetHousesParams {
  page?: number
}

export type HousesResponse = PaginatedApiResponse<HouseResource>
export type HouseResponse = ApiResponse<HouseResource>
export type HouseDeleteResponse = ApiResponse<null>

export const getHouses = async (params?: GetHousesParams) => {
  try {
    const response = await api.get<HousesResponse>('/rumah', { params })
    return response.data
  } catch {
    throw new Error('Gagal mengambil data rumah.')
  }
}

export const getHouseById = async (id: number | string) => {
  try {
    const response = await api.get<HouseResponse>(`/rumah/${id}`)
    return response.data
  } catch {
    throw new Error('Gagal mengambil detail rumah.')
  }
}

export const createHouse = async (payload: HousePayload) => {
  try {
    const response = await api.post<HouseResponse>('/rumah', payload)
    return response.data
  } catch {
    throw new Error('Gagal menambahkan rumah.')
  }
}

export const updateHouse = async (id: number | string, payload: HousePayload) => {
  try {
    const response = await api.put<HouseResponse>(`/rumah/${id}`, payload)
    return response.data
  } catch {
    throw new Error('Gagal memperbarui rumah.')
  }
}

export const deleteHouse = async (id: number | string) => {
  try {
    const response = await api.delete<HouseDeleteResponse>(`/rumah/${id}`)
    return response.data
  } catch {
    throw new Error('Gagal menghapus rumah.')
  }
}
