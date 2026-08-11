import { apiFetch } from '@/utils/apiFetch'
import type { PricingPlan } from '../types'

/**
 * -------------------------
 * Types
 * -------------------------
 */

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

/**
 * -------------------------
 * Auth Service
 * -------------------------
 */

export const authService = {

  /**
   * Register a new workspace + user.
   *
   * Backend sets HttpOnly cookies:
   * - access_token
   * - refresh_token
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Registration failed')
    }

    return await response.json()
  
  },


  /**
   * Login user.
   *
   * Backend sets HttpOnly cookies.
   * Frontend never receives JWTs.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {

    const formData = new URLSearchParams()
    formData.append('username', payload.email)
    formData.append('password', payload.password)

    const response = await apiFetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Incorrect email or password')
    }

    return await response.json()

  },


  /**
   * Finalise invited user onboarding.
   *
   * Backend sets HttpOnly cookies.
   */
  async onboard(payload: OnboardPayload): Promise<AuthResponse> {

    const response = await apiFetch('/auth/onboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Onboarding activation failed')
    }

    return await response.json()

  },


  /**
   * Refresh access token.
   *
   * Browser automatically sends refresh_token cookie.
   *
   * Backend:
   * - validates refresh token
   * - creates new access token
   * - replaces access_token cookie
   */
  async refreshAccessToken(): Promise<void> {

    const response = await apiFetch('/auth/refresh', {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Session expired')
    }
  },


  /**
   * Get currently authenticated user.
   *
   * Backend reads access_token cookie.
   */
  async getCurrentUser(explicitWorkspaceId?: string): Promise<AuthUser> {
    const workspaceId = explicitWorkspaceId || localStorage.getItem('workspace_id')
  
    if (!workspaceId) {
      throw new Error('No workspace selected')
    }

    const response = await apiFetch(`/${workspaceId}/me`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error('Not authorized to view this profile context')
    }

    const data = await response.json()

    this._saveAuthContext(data)

    return data
  },


  /**
   * Logout user.
   *
   * Backend:
   * - invalidates refresh session
   * - clears HttpOnly cookies
   */
  async logout(): Promise<void> {

    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
      })

    } catch (error) {

      console.warn(
        'Server logout failed:',
        error
      )

    } finally {

      localStorage.removeItem('workspace_id')
      localStorage.removeItem('role')
      localStorage.removeItem('status')

      if (typeof window !== 'undefined') {
        window.location.href = '/auth'
      }
    }
  },

  _saveAuthContext(data: AuthUser) {
    localStorage.setItem('workspace_id', data.workspace_id)
    localStorage.setItem('role', data.role)
    localStorage.setItem('status', data.status)
    localStorage.setItem('email', data.email)
    localStorage.setItem('first_name', data.first_name)
    localStorage.setItem('last_name', data.last_name)
  },

  _deleteAuthContext() {
    localStorage.removeItem('workspace_id')
    localStorage.removeItem('role')
    localStorage.removeItem('status')
    localStorage.removeItem('email')
    localStorage.removeItem('first_name')
    localStorage.removeItem('last_name')
  },
}
