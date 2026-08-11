import type { RouteRecordRaw } from 'vue-router'

export const customersRoutes: RouteRecordRaw = {
  path: 'customers',
  children: [
    {
      path: '',
      name: 'customers',
      component: () => import('./views/CustomersView.vue'),
      meta: { 
        title: 'Customers', 
        description: 'Manage your client network and view their order histories.' 
      }
    },
    {
      path: ':id',
      name: 'customer-details',
      component: () => import('./views/CustomerDetailView.vue'),
      meta: { 
        title: 'Customer Details', 
        description: 'View individual customer profiles and ledger activity.' 
      }
    }
  ]
}
