import { useMutation } from '@tanstack/react-query'

import { uploadImageResident } from '@/api/residents'

export const useUploadResidentImage = () => {
  return useMutation({
    mutationFn: uploadImageResident,
  })
}
