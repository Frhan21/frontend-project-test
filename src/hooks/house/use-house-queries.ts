import {
  createHouse,
  deleteHouse,
  getHouses,
  updateHouse,
  type GetHousesParams,
  type HousePayload,
  type HouseResource,
} from '@/api/house'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PaginationMeta } from '@/types/api-response'

export const houseQueryKeys = {
  all: ['houses'] as const,
  list: (params?: GetHousesParams) => [...houseQueryKeys.all, params] as const,
}

export interface HouseListResult {
  rows: HouseResource[]
  meta: PaginationMeta
}

export const useQueryHouse = (params?: GetHousesParams) =>
  useQuery({
    queryKey: houseQueryKeys.list(params),
    queryFn: () => getHouses(params),
    select: (response): HouseListResult => ({
      rows: response.data.data,
      meta: response.meta,
    }),
  })

export const useCreateHouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: HousePayload) => createHouse(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: houseQueryKeys.all }),
  })
}

export const useUpdateHouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: HousePayload }) =>
      updateHouse(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: houseQueryKeys.all }),
  })
}

export const useDeleteHouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => deleteHouse(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: houseQueryKeys.all }),
  })
}
