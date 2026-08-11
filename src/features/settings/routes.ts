import type { RouteRecordRaw } from 'vue-router'

export const settingsRoutes: RouteRecordRaw = {
  path: 'settings',
  component: () => import('./views/SettingsLayout.vue'),
  children: [
    {
      path: '',
      name: 'settings',
      component: () => import('./views/Index.vue'),
    },
    {
      path: 'billing',
      name: 'settings-billing',
      component: () => import('./views/Billing.vue'),
      meta: { title: 'Billing & Usage', description: 'Review system allocations and quotas.' }
    },
    {
      path: 'contact',
      name: 'settings-contact',
      component: () => import('./views/Contact.vue'),
      meta: { title: 'Company Profile', description: 'Manage your primary business details.' }
    },
    {
      path: 'permissions',
      name: 'settings-permissions',
      component: () => import('./views/Permissions.vue'),
      meta: { title: 'Team Permissions', description: 'Control who has workspace access.' }
    }
  ]
}
