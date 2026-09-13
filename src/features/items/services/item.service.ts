// src/services/item.service.ts

import { apiFetch } from '@/utils/apiFetch'
import type { Item, ItemCreate, ItemUpdate, ItemFilterParams, PaginatedItems } from '../types/item.types'

class ItemService {

  async getAll(
    workspaceId: string, 
    search?: string, 
    page = 1, 
    limit = 20,
    filters?: ItemFilterParams
  ): Promise<PaginatedItems> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (search) {
      params.append('search', search)
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    
    const response = await apiFetch(`/${workspaceId}/items?${params}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async getOne(workspaceId: string, itemId: string): Promise<Item> {
    const response = await apiFetch(`/${workspaceId}/items/${itemId}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async create(workspaceId: string, payload: ItemCreate): Promise<Item> {
    const response = await apiFetch(`/${workspaceId}/items`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async update(workspaceId: string, itemId: string, payload: ItemUpdate): Promise<Item> {
    const response = await apiFetch(`/${workspaceId}/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async delete(workspaceId: string, itemId: string): Promise<void> {
    await apiFetch(`/${workspaceId}/items/${itemId}`, {
      method: 'DELETE'
    })
  }
}

export const itemService = new ItemService()
