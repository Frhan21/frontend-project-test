import { type CategoryProps, createCategory } from '@/api/category'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { categoryQueryKeys } from '@/hooks/category/use-query-category'

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CategoryProps) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.all,
      })
    },
  })
}
