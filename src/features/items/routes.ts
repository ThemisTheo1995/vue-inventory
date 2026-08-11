import type { RouteRecordRaw } from 'vue-router'

export const itemsRoutes: RouteRecordRaw = {
  path: 'items',
  children: [
    {
      path: '',
      name: 'items',
      component: () => import('./views/ItemsView.vue'),
      meta: {
        title: 'Items', 
        description: 'Manage your items.'
      }
    },
    {
      path: ':id',
      name: 'item-details',
      component: () => import('./views/ItemDetailView.vue'),
      meta: { 
        title: 'Item', 
        description: 'View individual item.' 
      }
    }
  ]
}
