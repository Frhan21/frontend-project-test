import {
  getResidents,
  type GetResidentsParams,
  type ResidentResource,
} from '@/api/residents'
import { useQuery } from '@tanstack/react-query'
import type { PaginationMeta } from '@/types/api-response'

export const residentQueryKeys = {
  all: ['residents'] as const,
  list: (params?: GetResidentsParams) => [...residentQueryKeys.all, params] as const,
}

export interface ResidentListResult {
  rows: ResidentResource[]
  meta: PaginationMeta
}

export const useQueryResident = (params?: GetResidentsParams) => {
  return useQuery({
    queryKey: residentQueryKeys.list(params),
    queryFn: () => getResidents(params),
    select: (response): ResidentListResult => ({
      rows: response.data.data,
      meta: response.meta,
    }),
  })
}
