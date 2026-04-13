import axios from 'axios'

const TOKEN_STORAGE_KEY = 'token'
const SESSION_STORAGE_KEY = 'frontend-test.session'

function getStoredToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

function clearStoredAuth() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken()

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401 || status === 403) {
      clearStoredAuth()
    }

    return Promise.reject(error)
  }
)
