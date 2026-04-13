import { api } from '@/lib/axios'

export interface RegisterProps {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const register = async ({
  name,
  email,
  password,
  password_confirmation,
}: RegisterProps) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation,
    })

    return response.data
  } catch (error) {
    throw new Error('Register gagal. Pastikan data yang kamu isi sudah benar.')
  }
}
