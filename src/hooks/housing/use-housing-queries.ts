import {
  createHousing,
  deleteHousing,
  getHousing,
  updateHousing,
  type GetHousingParams,
  type HousingPayload,
  type HousingResource,
} from '@/api/housing'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PaginationMeta } from '@/types/api-response'

export const housingQueryKeys = {
  all: ['housings'] as const,
  list: (params?: GetHousingParams) => [...housingQueryKeys.all, params] as const,
}

export interface HousingListResult {
  rows: HousingResource[]
  meta: PaginationMeta
}

export const useQueryHousing = (params?: GetHousingParams) =>
  useQuery({
    queryKey: housingQueryKeys.list(params),
    queryFn: () => getHousing(params),
    select: (response): HousingListResult => ({
      rows: response.data.data,
      meta: response.meta,
    }),
  })

export const useCreateHousing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: HousingPayload) => createHousing(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: housingQueryKeys.all }),
  })
}

export const useUpdateHousing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: HousingPayload }) =>
      updateHousing(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: housingQueryKeys.all }),
  })
}

export const useDeleteHousing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => deleteHousing(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: housingQueryKeys.all }),
  })
}
