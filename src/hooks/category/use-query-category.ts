import {
  getCategories,
  normalizeCategoryList,
  type CategoryResource,
  type GetCategoriesParams,
} from '@/api/category'
import type { PaginationMeta } from '@/types/api-response'
import { useQuery } from '@tanstack/react-query'

export const categoryQueryKeys = {
  all: ['categories'] as const,
  list: (params?: GetCategoriesParams) => [...categoryQueryKeys.all, params] as const,
}

export interface CategoryListResult {
  rows: CategoryResource[]
  meta: PaginationMeta
}

export const useQueryCategory = (params?: GetCategoriesParams) => {
  return useQuery({
    queryKey: categoryQueryKeys.list(params),
    queryFn: () => getCategories(params),
    select: (response): CategoryListResult => normalizeCategoryList(response),
  })
}
