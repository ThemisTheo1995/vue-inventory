// src/services/sell_orders.service.ts

import { apiFetch } from '@/utils/apiFetch'
import type { 
  SellOrder, 
  SellOrderCreate, 
  SellOrderUpdate, 
  PaginatedSellOrders,
  SellOrderLine,
  SellOrderLineCreate
} from '../types/sell_order.types'

class SellOrderService {

  // =======================================================
  // Sell Order Headers
  // =======================================================

  async getAll(workspaceId: string, search?: string, page = 1, limit = 20): Promise<PaginatedSellOrders> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (search) {
      params.append('search', search)
    }
    
    const response = await apiFetch(`/${workspaceId}/sell-orders?${params}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async getOne(workspaceId: string, sellOrderId: string): Promise<SellOrder> {
    const response = await apiFetch(`/${workspaceId}/sell-orders/${sellOrderId}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async create(workspaceId: string, payload: SellOrderCreate): Promise<SellOrder> {
    const response = await apiFetch(`/${workspaceId}/sell-orders`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async update(workspaceId: string, sellOrderId: string, payload: SellOrderUpdate): Promise<SellOrder> {
    const response = await apiFetch(`/${workspaceId}/sell-orders/${sellOrderId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async delete(workspaceId: string, sellOrderId: string): Promise<void> {
    await apiFetch(`/${workspaceId}/sell-orders/${sellOrderId}`, {
      method: 'DELETE'
    })
  }

  // =======================================================
  // Sell Order Lines (Sub-Resources)
  // =======================================================

  async addLine(
    workspaceId: string, 
    sellOrderId: string, 
    payload: SellOrderLineCreate
  ): Promise<SellOrderLine> {
    const response = await apiFetch(`/${workspaceId}/sell-orders/${sellOrderId}/lines`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async updateLine(
    workspaceId: string, 
    sellOrderId: string, 
    lineId: string, 
    payload: Partial<SellOrderLineCreate>
  ): Promise<SellOrderLine> {
    const response = await apiFetch(`/${workspaceId}/sell-orders/${sellOrderId}/lines/${lineId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async removeLine(
    workspaceId: string, 
    sellOrderId: string, 
    lineId: string
  ): Promise<void> {
    await apiFetch(`/${workspaceId}/sell-orders/${sellOrderId}/lines/${lineId}`, {
      method: 'DELETE'
    })
  }
}

export const sellOrderService = new SellOrderService()
