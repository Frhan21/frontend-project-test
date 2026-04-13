import {
  createFee,
  deleteFee,
  getFees,
  updateFee,
  type FeePayload,
  type FeeResource,
  type GetFeesParams,
} from '@/api/fee'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PaginationMeta } from '@/types/api-response'

export const feeQueryKeys = {
  all: ['fees'] as const,
  list: (params?: GetFeesParams) => [...feeQueryKeys.all, params] as const,
}

export interface FeeListResult {
  rows: FeeResource[]
  meta: PaginationMeta
}

export const useQueryFee = (params?: GetFeesParams) =>
  useQuery({
    queryKey: feeQueryKeys.list(params),
    queryFn: () => getFees(params),
    select: (response): FeeListResult => ({
      rows: response.data.data,
      meta: response.meta,
    }),
  })

export const useCreateFee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: FeePayload) => createFee(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feeQueryKeys.all }),
  })
}

export const useUpdateFee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: FeePayload }) =>
      updateFee(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feeQueryKeys.all }),
  })
}

export const useDeleteFee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => deleteFee(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feeQueryKeys.all }),
  })
}
