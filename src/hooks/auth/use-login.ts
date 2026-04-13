import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'

import type { LoginProps } from '@/api/auth/login'
import { useSession } from '@/providers/session-provider'

type LocationState = {
  from?: string
}

export const useLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useSession()

  const redirectTo = (location.state as LocationState | null)?.from || '/dashboard'

  return useMutation({
    mutationFn: (payload: LoginProps) => login(payload),
    onSuccess: () => {
      navigate(redirectTo, { replace: true })
    },
  })
}
