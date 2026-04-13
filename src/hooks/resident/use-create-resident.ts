import { createResident, type CreateResidentPayload } from '@/api/residents'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { residentQueryKeys } from '@/hooks/resident/use-query-resident'

export const useCreateResident = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateResidentPayload) => createResident(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: residentQueryKeys.all,
      })
    },
  })
}
