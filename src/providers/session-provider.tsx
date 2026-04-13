import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type User = {
  name: string
  email: string
  role: 'Admin' | 'Manager'
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
  confirmation_password: string
}

type SessionContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

import { login as loginRequest } from "@/api/auth/login";
import { register as registerRequest } from "@/api/auth/register";

const SESSION_STORAGE_KEY = 'frontend-test.session'
const TOKEN_STORAGE_KEY = 'token'

const SessionContext = createContext<SessionContextType | null>(null)

function readStoredSession(): User | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession) as User
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

function saveSession(user: User | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (!user) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
}

function saveToken(token: string | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (!token) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

function readTokenFromResponse(data: unknown) {
  if (!data || typeof data !== 'object') {
    return null
  }

  const response = data as Record<string, unknown>
  const nestedData =
    response.data && typeof response.data === 'object'
      ? (response.data as Record<string, unknown>)
      : null

  return (
    (typeof response.token === 'string' && response.token) ||
    (typeof response.access_token === 'string' && response.access_token) ||
    (nestedData && typeof nestedData.token === 'string' && nestedData.token) ||
    (nestedData && typeof nestedData.access_token === 'string' && nestedData.access_token) ||
    null
  )
}

function readUserFromResponse(
  data: unknown,
  fallback: Pick<User, 'name' | 'email' | 'role'>
) {
  if (!data || typeof data !== 'object') {
    return fallback
  }

  const response = data as Record<string, unknown>
  const nestedData =
    response.data && typeof response.data === 'object'
      ? (response.data as Record<string, unknown>)
      : null
  const rawUser =
    response.user && typeof response.user === 'object'
      ? (response.user as Record<string, unknown>)
      : nestedData && nestedData.user && typeof nestedData.user === 'object'
        ? (nestedData.user as Record<string, unknown>)
        : null

  if (!rawUser) {
    return fallback
  }

  return {
    name: typeof rawUser.name === 'string' ? rawUser.name : fallback.name,
    email: typeof rawUser.email === 'string' ? rawUser.email : fallback.email,
    role:
      rawUser.role === 'Admin' || rawUser.role === 'Manager'
        ? rawUser.role
        : fallback.role,
  }
}

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredSession())

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login: async ({ email, password }: LoginPayload) => {
        const response = await loginRequest({ email, password })
        const fallbackUser: User = {
          name: email.split('@')[0] || 'Admin',
          email,
          role: 'Admin',
        }
        const nextUser = readUserFromResponse(response, fallbackUser)
        const token = readTokenFromResponse(response)

        saveToken(token)
        saveSession(nextUser)
        setUser(nextUser)
      },
      register: async ({ name, email, password, confirmation_password }: RegisterPayload) => {
        const response = await registerRequest({
          name,
          email,
          password,
          password_confirmation: confirmation_password,
        })
        const fallbackUser: User = {
          name,
          email,
          role: 'Manager',
        }
        const nextUser = readUserFromResponse(response, fallbackUser)
        const token = readTokenFromResponse(response)

        saveToken(token)
        saveSession(nextUser)
        setUser(nextUser)
      },
      logout: () => {
        saveToken(null)
        saveSession(null)
        setUser(null)
      },
    }),
    [user]
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export const useSession = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used inside SessionProvider')
  }

  return context
}
