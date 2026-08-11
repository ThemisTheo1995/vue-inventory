import { defineStore } from 'pinia'
import type { AuthUser } from '../services/auth.service'
import { authService } from '../services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async initialize(workspaceIdFromUrl?: string) {

      try {
        const user = await authService.getCurrentUser(workspaceIdFromUrl)
        this.user = user

        localStorage.setItem('workspace_id', user.workspace_id)
        localStorage.setItem('role', user.role)
        localStorage.setItem('status', user.status)
      } catch (error) {
        this.clearUser()
        throw error
      } finally {
        this.initialized = true
      }
    },

    clearUser() {
      this.user = null
      localStorage.removeItem('workspace_id')
      localStorage.removeItem('role')
      localStorage.removeItem('status')
    },
  },
})
