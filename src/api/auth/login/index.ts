import { api } from '@/lib/axios'

export interface LoginProps {
  email: string
  password: string
}

export const login = async ({ email, password }: LoginProps) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  } catch (error) {
    throw new Error('Login gagal. Periksa kembali email dan password kamu.')
  }
}
