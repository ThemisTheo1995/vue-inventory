import type { RouteRecordRaw } from 'vue-router'

export const binsRoutes: RouteRecordRaw = {
  path: 'bins',
  children: [
    {
      path: '',
      name: 'bins',
      component: () => import('./views/BinsView.vue'),
      meta: { 
        title: 'Bins', 
        description: 'Manage your storage bins.' 
      }
    },
    {
      path: ':id',
      name: 'bin-details',
      component: () => import('./views/BinDetailView.vue'),
      meta: { 
        title: 'Bin Details', 
        description: 'View individual bin details.' 
      }
    }
  ]
}
