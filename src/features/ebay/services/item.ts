// src/service/ebay/item.ts
import { apiFetch } from '@/utils/apiFetch'

export interface EbayItem {
  workspace_id: string;
  external_id: string;
  sku: string;
  marketplace: string;
  name: string;
  price: {
    value: number;
    currency: string;
  };
  stock_quantity: number;
  status: string;
  image_url: string | null;
  metadata: Record<string, string[]>;
}


export const ebayItemService = {
  /**
   * Fetch all items from the eBay integration
   */
  async getItems(workspaceId: string): Promise<EbayItem[]> {
  
    const response = await apiFetch(`/${workspaceId}/integrations/ebay/items`, {
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch eBay items');
    }

    return response.json();
  }

};
