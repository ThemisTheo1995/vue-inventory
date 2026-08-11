import { apiFetch } from '@/utils/apiFetch'
import type { Customer, CustomerCreate, CustomerUpdate, PaginatedCustomers } from '../types/customer.types'

class CustomerService {

  async getAll(workspaceId: string, search?: string, page = 1, limit = 20): Promise<PaginatedCustomers> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (search) {
      params.append('search', search)
    }
    
    const response = await apiFetch(`/${workspaceId}/customers?${params}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async getOne(workspaceId: string, customerId: string): Promise<Customer> {
    const response = await apiFetch(`/${workspaceId}/customers/${customerId}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  async create(workspaceId: string, payload: CustomerCreate): Promise<Customer> {

    const response = await apiFetch(`/${workspaceId}/customers`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async update(workspaceId: string, customerId: string, payload: CustomerUpdate): Promise<Customer> {
    const response = await apiFetch(`/${workspaceId}/customers/${customerId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
    
    return await response.json()
  }

  async delete(workspaceId: string, customerId: string): Promise<void> {
    await apiFetch(`/${workspaceId}/customers/${customerId}`, {
      method: 'DELETE'
    })
  }
}

export const customerService = new CustomerService()
