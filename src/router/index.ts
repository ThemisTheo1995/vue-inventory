import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '../components/layout/BaseLayout.vue'

import { authRoutes } from '../features/auth/routes'
import { dashboardRoutes } from '../features/dashboard/routes'
import { settingsRoutes } from '../features/settings/routes'
import { RootRoute } from '../features/root/routes'
import { customersRoutes } from '../features/customers/routes'
import { suppliersRoutes } from '../features/suppliers/routes'
import { inventoryRoutes } from '../features/inventory/routes'
import { itemsRoutes } from '../features/items/routes'
import { purchaseOrdersRoutes } from '../features/purchase_orders/routes'
import { sellOrdersRoutes } from '../features/sell_orders/routes'
import { userRoutes } from '../features/user/routes'

import { useAuthStore } from '../features/auth/services/auth.store.ts'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    RootRoute,
    authRoutes,

    {
      path: '/:workspaceId',
      component: BaseLayout,
      children: [
        userRoutes,
        dashboardRoutes,
        settingsRoutes,
        customersRoutes,
        suppliersRoutes,
        inventoryRoutes,
        itemsRoutes,
        purchaseOrdersRoutes,
        sellOrdersRoutes
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/auth',
    },
  ],
})


router.beforeEach(async (to) => {

  /**
   * Public routes do not need auth.
   */
  if (to.meta.public) {
    return true
  }


  const workspaceId = to.params.workspaceId as string


  /**
   * Validate workspace URL first.
   */
  if (workspaceId) {

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i


    if (!uuidPattern.test(workspaceId)) {

      return {
        name: 'auth',
      }

    }
  }


  const authStore = useAuthStore()


  /**
   * Load current user/workspace once.
   */
  if (!authStore.initialized) {

    await authStore.initialize(workspaceId)

  }


  /**
   * No valid session.
   */
  if (!authStore.isAuthenticated) {

    return {
      name: 'auth',
    }

  }


  return true
})


export default router
