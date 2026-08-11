import { useToast } from '../composables/useToast'
import { useAuthStore } from '@/features/auth/services/auth.store'

const { showToast } = useToast()
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

let activeRefreshPromise: Promise<boolean> | null = null

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  forceToast = true
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`
  options.credentials = 'include'

  if (!options.headers) {
    options.headers = {}
  }

  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  options.headers = headers

  try {
    let response = await fetch(url, options)

    if (response.status === 401 && !endpoint.includes('/auth/refresh')) {
      if (!activeRefreshPromise) {
        activeRefreshPromise = (async () => {
          try {
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              credentials: 'include',
            })
            return refreshRes.ok
          } catch {
            return false
          }
        })()
      }

      const refreshSuccessful = await activeRefreshPromise
      activeRefreshPromise = null

      if (refreshSuccessful) {
        response = await fetch(url, options)
      } else {
        const authStore = useAuthStore()
        authStore.clearUser()

        window.location.href = '/auth'

        throw new Error('Session expired. Please login again.')
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.detail || 'An unexpected server error occurred.'

      if (forceToast) {
        showToast(errorMessage, 'error', 'Action Denied')
      }

      throw new Error(errorMessage)
    }

    return response
  } catch (error: any) {
    if (error.name === 'TypeError') {
      showToast(
        'Network error - cannot connect to the server.',
        'error',
        'Connection Error'
      )
    }
    throw error
  }
}
