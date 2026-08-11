import type { RouteRecordRaw } from 'vue-router'

export const purchaseOrdersRoutes: RouteRecordRaw = {
  path: 'purchase-orders',
  children: [
    {
      path: '',
      name: 'purchase-orders',
      component: () => import('./views/PurchaseOrdersView.vue'),
      meta: { 
        title: 'Purchase Order', 
        description: 'Manage your purchase orders.'
      }
    },
    {
      path: ':id',
      name: 'purchase-order-details',
      component: () => import('./views/PurchaseOrderDetailView.vue'),
      meta: { 
        title: 'Purchase Order Details', 
        description: 'View individual purchase order.' 
      }
    }
  ]
}
