// src/features/search/services/searchService.ts
import { apiFetch } from '@/utils/apiFetch'
import type { SearchResult } from '../types/search.types'

export const searchService = {
  async search(workspaceId: string, query: string, limit = 8): Promise<SearchResult[]> {
    if (!query.trim()) return []

    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    })

    const response = await apiFetch(
      `/${workspaceId}/search?${params.toString()}`,
      { method: 'GET' },
      false
    )

    const data: SearchResult[] = await response.json()
    return data
  },
}
