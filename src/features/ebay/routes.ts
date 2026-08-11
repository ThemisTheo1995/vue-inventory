// src/features/ebay/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const ebayRoutes: RouteRecordRaw = {
  path: 'integrations/ebay',
  name: 'ebay',
  component: () => import('./views/Index.vue')
}
