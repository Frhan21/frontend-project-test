import { updateCategory, type CategoryProps } from '@/api/category'
import { categoryQueryKeys } from '@/hooks/category/use-query-category'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: CategoryProps }) =>
      updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
    },
  })
}
