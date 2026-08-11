import { keysToSnake } from '@/utils/caseTransformer'
import { apiFetch } from '@/utils/apiFetch'
import type { WorkspaceContact, WorkspaceContactUpdate } from '../types'

class WorkspaceContactService {

  async getWorkspaceContact(workspaceId: string): Promise<WorkspaceContact> {
    if (!workspaceId || workspaceId === 'undefined') throw new Error('Invalid workspace ID')

    const response = await apiFetch(`/${workspaceId}`, {
      method: 'GET',
    })

    if (!response.ok) throw new Error('Failed to fetch workspace')
    return response.json()
  }

  async updateWorkspaceContact(workspaceId: string, updateData: WorkspaceContactUpdate): Promise<WorkspaceContact> {
    if (!workspaceId || workspaceId === 'undefined') throw new Error('Invalid workspace ID')

    const snakePayload = keysToSnake(updateData)

    const response = await apiFetch(`/${workspaceId}`, {
      method: 'PATCH',
      body: JSON.stringify(snakePayload),
    })

    if (!response.ok) throw new Error('Failed to update workspace')
    return response.json()
  }
}

export const workspaceContactService = new WorkspaceContactService()
