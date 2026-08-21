import { keysToSnake } from '@/utils/caseTransformer'
import { apiFetch } from '@/utils/apiFetch'


export interface WorkspaceMember {
  id: string
  name: string | null
  email: string
  role: 'full_admin' | 'edit_only' | 'read_only'
  status: 'active' | 'pending'
}

export interface InvitePayload {
  email: string
  role: string
}

class PermissionService {

  async getMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const response = await apiFetch(`/${workspaceId}/workspace-users`, {
      method: 'GET',
    })
    if (!response.ok) throw new Error('Failed to fetch workspace members')

    return response.json()
  }

  async inviteMember(workspaceId: string, payload: InvitePayload): Promise<WorkspaceMember> {

    const snakePayload = keysToSnake(payload)

    const response = await apiFetch(`/${workspaceId}/workspace-users/invite`, {
      method: 'POST',
      body: JSON.stringify(snakePayload),
    })
    if (!response.ok) throw new Error('Failed to send workspace invitation')
    return response.json()
  }

  async updateMemberRole(workspaceId: string, workspaceUserId: string, role: string): Promise<void> {

    const roleCleaned = keysToSnake(role)
  
    const response = await apiFetch(`/${workspaceId}/workspace-users/${workspaceUserId}`, {
      method: 'PATCH',
      body: JSON.stringify({ role: roleCleaned }),
    })
    if (!response.ok) throw new Error('Failed to update member role')
  }

  async removeMember(workspaceId: string, workspaceUserId: string): Promise<void> {
    const response = await apiFetch(`/${workspaceId}/workspace-users/${workspaceUserId}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_deleted: true }),
    })
    if (!response.ok) throw new Error('Failed to remove member from workspace')
  }
}

export const permissionService = new PermissionService()
