import { api } from '@/lib/axios'
import type { ApiResponse, PaginatedApiResponse, PaginationMeta } from '@/types/api-response'

export interface CategoryProps {
  name: string
}

export interface CategoryResource {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export interface GetCategoriesParams {
  page?: number
}

export type CategoryResponse = ApiResponse<CategoryResource>
export type CategoriesResponse = PaginatedApiResponse<CategoryResource> | ApiResponse<CategoryResource[]>
export type CategoryDeleteResponse = ApiResponse<null>

const emptyMeta: PaginationMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 0,
  total: 0,
}

export const getCategories = async (params?: GetCategoriesParams) => {
  try {
    const response = await api.get<CategoriesResponse>('/category', { params })
    return response.data
  } catch {
    throw new Error('Gagal mengambil data kategori.')
  }
}

export const getCategoryById = async (id: number | string) => {
  try {
    const response = await api.get<CategoryResponse>(`/category/${id}`)
    return response.data
  } catch {
    throw new Error('Gagal mengambil detail kategori.')
  }
}

export const createCategory = async (payload: CategoryProps) => {
  try {
    const response = await api.post<CategoryResponse>('/category', payload)
    return response.data
  } catch {
    throw new Error('Gagal menambahkan kategori.')
  }
}

export const updateCategory = async (id: number | string, payload: CategoryProps) => {
  try {
    const response = await api.put<CategoryResponse>(`/category/${id}`, payload)
    return response.data
  } catch {
    throw new Error('Gagal memperbarui kategori.')
  }
}

export const deleteCategory = async (id: number | string) => {
  try {
    const response = await api.delete<CategoryDeleteResponse>(`/category/${id}`)
    return response.data
  } catch {
    throw new Error('Gagal menghapus kategori.')
  }
}

export const normalizeCategoryList = (response: CategoriesResponse) => {
  if (Array.isArray(response.data)) {
    return {
      rows: response.data,
      meta: {
        ...emptyMeta,
        per_page: response.data.length,
        total: response.data.length,
      },
    }
  }

  const paginationMeta = 'meta' in response ? response.meta : undefined

  return {
    rows: response.data.data,
    meta: paginationMeta ?? {
      ...emptyMeta,
      per_page: response.data.data.length,
      total: response.data.data.length,
    },
  }
}
