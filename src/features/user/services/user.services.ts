import { apiFetch } from '@/utils/apiFetch'
import type { User, UserUpdate } from '../types/user.types'

class UserService {
  /**
   * Update the currently authenticated user's personal details for a specific workspace.
   */
  async updateUser(workspaceId: string, updates: UserUpdate): Promise<User> {
    const response = await apiFetch(`/${workspaceId}/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Failed to update user details')
    }

    return await response.json()
  }
}

export const userService = new UserService()
