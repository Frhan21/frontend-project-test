import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import type { RegisterProps } from '@/api/auth/register'
import { useSession } from '@/providers/session-provider'

type RegisterFormValues = Omit<RegisterProps, 'password_confirmation'> & {
  confirmation_password: string
}

export const useRegister = () => {
  const navigate = useNavigate()
  const { register } = useSession()

  return useMutation({
    mutationFn: (payload: RegisterFormValues) => register(payload),
    onSuccess: () => {
      navigate('/dashboard', { replace: true })
    },
  })
}
