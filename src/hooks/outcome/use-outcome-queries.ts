import {
  createOutcome,
  deleteOutcome,
  getOutcomes,
  updateOutcome,
  type GetOutcomeParams,
  type OutcomePayload,
  type OutcomeResource,
} from '@/api/outcome'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PaginationMeta } from '@/types/api-response'

export const outcomeQueryKeys = {
  all: ['outcomes'] as const,
  list: (params?: GetOutcomeParams) => [...outcomeQueryKeys.all, params] as const,
}

export interface OutcomeListResult {
  rows: OutcomeResource[]
  meta: PaginationMeta
}

export const useQueryOutcome = (params?: GetOutcomeParams) =>
  useQuery({
    queryKey: outcomeQueryKeys.list(params),
    queryFn: () => getOutcomes(params),
    select: (response): OutcomeListResult => ({
      rows: response.data.data,
      meta: response.meta,
    }),
  })

export const useCreateOutcome = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: OutcomePayload) => createOutcome(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: outcomeQueryKeys.all }),
  })
}

export const useUpdateOutcome = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: OutcomePayload }) =>
      updateOutcome(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: outcomeQueryKeys.all }),
  })
}

export const useDeleteOutcome = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => deleteOutcome(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: outcomeQueryKeys.all }),
  })
}
