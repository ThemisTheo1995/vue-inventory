// src/features/dashboard/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw = {
  path: '',
  name: 'dashboard',
  component: () => import('./views/Dashboard.vue')
}
