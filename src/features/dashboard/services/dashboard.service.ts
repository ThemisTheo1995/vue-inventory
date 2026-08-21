import { apiFetch } from '@/utils/apiFetch'
import type { DashboardResponse } from '../types/dashboard.types'

class DashboardService {
  async get(workspaceId: string): Promise<DashboardResponse> {

    const response = await apiFetch(`/${workspaceId}/dashboard`, {
      method: 'GET'
    })

    return await response.json()
  }
}

export const dashboardService = new DashboardService()
