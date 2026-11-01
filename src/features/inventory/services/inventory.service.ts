// src/features/inventory/services/inventory.service.ts

import { apiFetch } from '@/utils/apiFetch'
import type { 
  Inventory, 
  InventoryExpanded,
  PaginatedInventory, 
  PaginatedExpandedInventory,
  StockMovement, 
  StockMovementCreate, 
  PaginatedStockMovements,
  InventoryTransferRequest,
  InventoryTransferResponse
} from '../types/inventory.types'

class InventoryService {

  // --- Inventory Endpoints (Overloaded for Expansion) ---

  async getInventory(
    workspaceId: string, 
    inventoryId: string,
    expand: string[]
  ): Promise<InventoryExpanded>;

  async getInventory(
    workspaceId: string, 
    inventoryId: string,
    expand?: string[]
  ): Promise<Inventory | InventoryExpanded>;

  async getInventory(
    workspaceId: string, 
    inventoryId: string,
    expand?: string[]
  ): Promise<Inventory | InventoryExpanded> {
    const params = new URLSearchParams()
    
    if (expand && expand.length > 0) {
      expand.forEach(item => params.append('expand', item))
    }
    
    const query = params.toString() ? `?${params.toString()}` : ''

    const response = await apiFetch(`/${workspaceId}/inventory/${inventoryId}${query}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async getInventories(
    workspaceId: string, 
    search?: string,
    page?: number, 
    limit?: number,
    expand?: string[]
  ): Promise<PaginatedExpandedInventory>;

  async getInventories(
    workspaceId: string, 
    search?: string,
    page?: number, 
    limit?: number,
    expand?: undefined
  ): Promise<PaginatedInventory>;

  async getInventories(
    workspaceId: string, 
    search?: string,
    page = 1, 
    limit = 20,
    expand?: string[]
  ): Promise<PaginatedInventory | PaginatedExpandedInventory> {
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
    
    const response = await apiFetch(`/${workspaceId}/inventory?${params}`, { 
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

  async getStockMovements(
    workspaceId: string, itemId?: string, binId?: string, page = 1, limit = 20): Promise<PaginatedStockMovements> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (itemId) {
      params.append('item_id', itemId)
    }
    
    if (binId) {
      params.append('bin_id', binId)
    }

    const response = await apiFetch(`/${workspaceId}/inventory/movements?${params}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  // --- Bin-to-Bin Transfer Endpoint ---

  async transferStock(workspaceId: string, payload: InventoryTransferRequest): Promise<InventoryTransferResponse> {
    const response = await apiFetch(`/${workspaceId}/inventory/transfer-bin-to-bin`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }
}

export const inventoryService = new InventoryService()
