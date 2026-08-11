import type { RouteRecordRaw } from 'vue-router'

export const suppliersRoutes: RouteRecordRaw = {
  path: 'suppliers',
  children: [
    {
      path: '',
      name: 'suppliers',
      component: () => import('./views/SuppliersView.vue'),
      meta: { 
        title: 'Suppliers', 
        description: 'Manage your supplier network and view their order histories.' 
      }
    },
    {
      path: ':id',
      name: 'supplier-details',
      component: () => import('./views/SupplierDetailView.vue'),
      meta: { 
        title: 'Supplier Details', 
        description: 'View individual supplier profiles and ledger activity.' 
      }
    }
  ]
}
