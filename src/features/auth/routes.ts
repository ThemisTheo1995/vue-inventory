// src/features/auth/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw = {
  path: '/auth',
  name: 'auth',
  component: () => import('./components/AuthLayout.vue'),
  meta: { public: true },
  children: [
    {
      path: '',
      redirect: { name: 'login' }
    },
    {
      path: 'login',
      name: 'login',
      component: () => import('./views/Login.vue'),
      meta: { public: true }
    },
    {
      path: 'register',
      name: 'register',
      component: () => import('./views/Register.vue'),
      meta: { public: true }
    },
    {
      path: 'onboard',
      name: 'auth-onboard',
      component: () => import('./views/Onboard.vue'),
      meta: { public: true }
    }
  ]
}
