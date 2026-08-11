import type { RouteRecordRaw } from 'vue-router'

export const RootRoute: RouteRecordRaw = {
  path: '',
  name: 'workspace-root',
  component: () => import('./views/Root.vue'),
  meta: {
    title: 'Synflow ERP',
    public: true
  }
}
