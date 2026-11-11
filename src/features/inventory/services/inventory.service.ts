
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
  InventoryTransferResponse,
  InventoryUpdate,
  InventoryFilterParams
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
    expand?: string[],
    filters?: InventoryFilterParams
  ): Promise<PaginatedExpandedInventory>;

  async getInventories(
    workspaceId: string,
    search?: string,
    page?: number,
    limit?: number,
    expand?: undefined,
    filters?: InventoryFilterParams
  ): Promise<PaginatedInventory>;

  async getInventories(
    workspaceId: string,
    search?: string,
    page = 1,
    limit = 20,
    expand?: string[],
    filters?: InventoryFilterParams
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

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }

    const response = await apiFetch(`/${workspaceId}/inventory?${params}`, {
      method: 'GET'
    })

    return await response.json()
  }

  async updateInventory(
    workspaceId: string,
    inventoryId: string,
    payload: InventoryUpdate
  ): Promise<Inventory> {
    const response = await apiFetch(`/${workspaceId}/inventory/${inventoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })

    return await response.json()
  }

  async deleteInventory(workspaceId: string, inventoryId: string): Promise<void> {
    await apiFetch(`/${workspaceId}/inventory/${inventoryId}`, {
      method: 'DELETE'
    })
  }

  // --- Stock Movement Endpoints ---

  async createStockMovement(
    workspaceId: string,
    payload: StockMovementCreate
  ): Promise<StockMovement> {
    const response = await apiFetch(`/${workspaceId}/inventory/movements`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    return await response.json()
  }

  async getStockMovements(
    workspaceId: string,
    itemId?: string,
    binId?: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedStockMovements> {
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

  async transferStock(
    workspaceId: string,
    payload: InventoryTransferRequest
  ): Promise<InventoryTransferResponse> {
    const response = await apiFetch(`/${workspaceId}/inventory/transfer-bin-to-bin`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    return await response.json()
  }
}

export const inventoryService = new InventoryService()
