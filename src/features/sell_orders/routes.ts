import type { RouteRecordRaw } from 'vue-router'

export const sellOrdersRoutes: RouteRecordRaw = {
  path: 'sell-orders',
  children: [
    {
      path: '',
      name: 'sell-orders',
      component: () => import('./views/SellOrdersView.vue'),
      meta: { 
        title: 'Sell Order', 
        description: 'Manage your sell orders.'
      }
    },
    {
      path: ':id',
      name: 'sell-order-details',
      component: () => import('./views/SellOrderDetailView.vue'),
      meta: { 
        title: 'Sell Order Details', 
        description: 'View individual sell order.' 
      }
    }
  ]
}
