import { deleteCategory } from '@/api/category'
import { categoryQueryKeys } from '@/hooks/category/use-query-category'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
    },
  })
}
