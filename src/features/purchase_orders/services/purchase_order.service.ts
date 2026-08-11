// src/services/purchase_orders.service.ts

import { apiFetch } from '@/utils/apiFetch'
import type { 
  PurchaseOrder, 
  PurchaseOrderCreate, 
  PurchaseOrderUpdate, 
  PaginatedPurchaseOrders,
  PurchaseOrderLine,
  PurchaseOrderLineCreate
} from '../types/purchase_order.types'

class PurchaseOrderService {

  // =======================================================
  // Purchase Order Headers
  // =======================================================

  async getAll(workspaceId: string, search?: string, page = 1, limit = 20): Promise<PaginatedPurchaseOrders> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (search) {
      params.append('search', search)
    }
    
    const response = await apiFetch(`/${workspaceId}/purchase-orders?${params}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async getOne(workspaceId: string, purchaseOrderId: string): Promise<PurchaseOrder> {
    const response = await apiFetch(`/${workspaceId}/purchase-orders/${purchaseOrderId}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async create(workspaceId: string, payload: PurchaseOrderCreate): Promise<PurchaseOrder> {
    const response = await apiFetch(`/${workspaceId}/purchase-orders`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async update(workspaceId: string, purchaseOrderId: string, payload: PurchaseOrderUpdate): Promise<PurchaseOrder> {
    const response = await apiFetch(`/${workspaceId}/purchase-orders/${purchaseOrderId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async delete(workspaceId: string, purchaseOrderId: string): Promise<void> {
    await apiFetch(`/${workspaceId}/purchase-orders/${purchaseOrderId}`, {
      method: 'DELETE'
    })
  }

  // =======================================================
  // Purchase Order Lines (Sub-Resources)
  // =======================================================

  async addLine(
    workspaceId: string, 
    purchaseOrderId: string, 
    payload: PurchaseOrderLineCreate
  ): Promise<PurchaseOrderLine> {
    const response = await apiFetch(`/${workspaceId}/purchase-orders/${purchaseOrderId}/lines`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async updateLine(
    workspaceId: string, 
    purchaseOrderId: string, 
    lineId: string, 
    payload: Partial<PurchaseOrderLineCreate>
  ): Promise<PurchaseOrderLine> {
    const response = await apiFetch(`/${workspaceId}/purchase-orders/${purchaseOrderId}/lines/${lineId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async removeLine(
    workspaceId: string, 
    purchaseOrderId: string, 
    lineId: string
  ): Promise<void> {
    await apiFetch(`/${workspaceId}/purchase-orders/${purchaseOrderId}/lines/${lineId}`, {
      method: 'DELETE'
    })
  }
}

export const purchaseOrderService = new PurchaseOrderService()
