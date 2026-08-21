import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw = {
  path: 'workspace-users',
  children: [
    {
      path: '',
      name: 'workspace-user',
      component: () => import('./views/UserDetailView.vue'),
      meta: { 
        title: 'Workspace User Details', 
        description: 'View the workspace user details.'
      }
    }
  ]
}
