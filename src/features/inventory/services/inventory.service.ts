// src/services/inventory.service.ts

import { apiFetch } from '@/utils/apiFetch'
import type { 
  Inventory, 
  PaginatedInventory, 
  StockMovement, 
  StockMovementCreate, 
  PaginatedStockMovements 
} from '../types/inventory.types'

class InventoryService {

  // --- Inventory Endpoints ---

  async getInventories(
    workspaceId: string, 
    page = 1, 
    limit = 20,
    expand?: string[]
  ): Promise<PaginatedInventory> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (expand && expand.length > 0) {
      params.append('expand', expand.join(','))
    }
    
    const response = await apiFetch(`/${workspaceId}/inventory?${params}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async getInventoryByItem(
    workspaceId: string, 
    itemId: string,
    expand?: string[]
  ): Promise<Inventory> {
    const params = new URLSearchParams()
    
    if (expand && expand.length > 0) {
      params.append('expand', expand.join(','))
    }
    
    const query = params.toString() ? `?${params.toString()}` : ''

    const response = await apiFetch(`/${workspaceId}/inventory/items/${itemId}${query}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  // --- Stock Movement Endpoints ---

  async createStockMovement(workspaceId: string, payload: StockMovementCreate): Promise<StockMovement> {
    const response = await apiFetch(`/${workspaceId}/inventory/movements`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async getStockMovements(workspaceId: string, itemId?: string, page = 1, limit = 20): Promise<PaginatedStockMovements> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (itemId) {
      params.append('item_id', itemId)
    }
    
    const response = await apiFetch(`/${workspaceId}/inventory/movements?${params}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }
}

export const inventoryService = new InventoryService()
