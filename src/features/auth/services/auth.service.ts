import { apiFetch } from '@/utils/apiFetch'
import { useAuthStore } from './auth.store'
import type { PricingPlan } from '../types'

export interface RegisterPayload {
  user: {
    first_name: string
    last_name: string
    email: string
    password: string
    confirm_password?: string
  }
  workspace: {
    name: string
    email: string
  }
  plan: PricingPlan
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  workspace_user_id: string
  email: string
  first_name: string
  last_name: string
  workspace_id: string
  role: string
  status: string
}

export interface AuthResponse {
  workspace_id: string
}

export interface OnboardPayload {
  email: string
  first_name: string
  last_name: string
  password: string
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Registration failed')
    }

    return await response.json()
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const formData = new URLSearchParams()
    formData.append('username', payload.email)
    formData.append('password', payload.password)

    const response = await apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Incorrect email or password')
    }

    return await response.json()
  },

  async onboard(payload: OnboardPayload): Promise<AuthResponse> {
    const response = await apiFetch('/auth/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Onboarding activation failed')
    }

    return await response.json()
  },

  async refreshAccessToken(): Promise<void> {
    const response = await apiFetch('/auth/refresh', {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Session expired')
    }
  },

  async getCurrentUser(explicitWorkspaceId?: string): Promise<AuthUser> {
    const workspaceId = explicitWorkspaceId || localStorage.getItem('workspace_id')

    if (!workspaceId) {
      throw new Error('No workspace selected')
    }

    const response = await apiFetch(`/${workspaceId}/me`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Not authorized to view this profile context')
    }

    return await response.json()
  },

  async logout(): Promise<void> {
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.warn('Server logout failed:', error)
    } finally {
      // Clear Pinia user state and localStorage in one call
      const authStore = useAuthStore()
      authStore.clearUser()

      if (typeof window !== 'undefined') {
        window.location.href = '/auth'
      }
    }
  },
}
