import { apiFetch } from '@/utils/apiFetch'
import type { Supplier, SupplierCreate, SupplierUpdate, PaginatedSuppliers } from '../types/supplier.types'

class SupplierService {

  async getAll(workspaceId: string, search?: string, page = 1, limit = 20): Promise<PaginatedSuppliers> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (search) {
      params.append('search', search)
    }
  
    const response = await apiFetch(`/${workspaceId}/suppliers?${params}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async getOne(workspaceId: string, supplierId: string): Promise<Supplier> {

    const response = await apiFetch(`/${workspaceId}/suppliers/${supplierId}`, { 
      method: 'GET'

    })
    
    return await response.json()
  }

  async create(workspaceId: string, payload: SupplierCreate): Promise<Supplier> {
    const response = await apiFetch(`/${workspaceId}/suppliers`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async update(workspaceId: string, supplierId: string, payload: SupplierUpdate): Promise<Supplier> {
  
    const response = await apiFetch(`/${workspaceId}/suppliers/${supplierId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async delete(workspaceId: string, supplierId: string): Promise<void> {

    await apiFetch(`/${workspaceId}/suppliers/${supplierId}`, {
      method: 'DELETE',
    })
  }
}

export const supplierService = new SupplierService()
