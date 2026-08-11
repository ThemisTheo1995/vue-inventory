// src/features/integrations/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const integrationsRoutes: RouteRecordRaw = {
  path: 'integrations',
  children: [
    {
      path: '',
      name: 'integrations',
      component: () => import('./views/Integrations.vue')
    },
    {
      path: ':id',
      name: 'integration-detail',
      component: () => import('./views/IntegrationDetail.vue')
    }
  ]
}
