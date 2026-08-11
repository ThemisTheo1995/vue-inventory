import type { RouteRecordRaw } from 'vue-router'

export const inventoryRoutes: RouteRecordRaw = {
  path: 'inventory',
  children: [
    {
      path: '',
      name: 'inventory',
      component: () => import('./views/InventoryView.vue'),
      meta: {
        title: 'Inventory', 
        description: 'Manage your inventory.'
      }
    },
    {
      path: ':id',
      name: 'inventory-details',
      component: () => import('./views/InventoryDetailView.vue'),
      meta: { 
        title: 'Inventory Movement', 
        description: 'View individual inventory movement.' 
      }
    }
  ]
}
