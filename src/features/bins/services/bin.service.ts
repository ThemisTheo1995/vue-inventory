// src/features/bins/services/bin.service.ts

import { apiFetch } from '@/utils/apiFetch'
import type { 
  Bin, 
  PaginatedBins, 
  BinCreate, 
  BinUpdate,
  BinDetail
} from '../types/bin.types'

class BinService {

  // --- Bin Endpoints ---

  async getBins(
    workspaceId: string, 
    search?: string,
    page = 1, 
    limit = 20,
    expand?: string[]
  ): Promise<PaginatedBins> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })

    if (search) {
      params.append('search', search)
    }

    if (expand && expand.length > 0) {
      expand.forEach(item => params.append('expand', item))
    }
    
    const response = await apiFetch(`/${workspaceId}/bins?${params}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async getBin(
    workspaceId: string, 
    binId: string,
    expand?: string[]
  ): Promise<BinDetail> {
    const params = new URLSearchParams()
    
    if (expand && expand.length > 0) {
      expand.forEach(item => params.append('expand', item))
    }
    
    const query = params.toString() ? `?${params.toString()}` : ''

    const response = await apiFetch(`/${workspaceId}/bins/${binId}${query}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async createBin(workspaceId: string, payload: BinCreate): Promise<Bin> {
    const response = await apiFetch(`/${workspaceId}/bins`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async updateBin(workspaceId: string, binId: string, payload: BinUpdate): Promise<Bin> {
    const response = await apiFetch(`/${workspaceId}/bins/${binId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async deleteBin(workspaceId: string, binId: string): Promise<void> {
    await apiFetch(`/${workspaceId}/bins/${binId}`, {
      method: 'DELETE'
    })
  }
}

export const binService = new BinService()
