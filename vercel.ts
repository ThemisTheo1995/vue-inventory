
import {
  routes,
  deploymentEnv,
  type VercelConfig,
} from '@vercel/config/v1'

const apiOrigin = deploymentEnv('API_ORIGIN')

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite(
      '/api/(.*)',
      `${apiOrigin}/$1`
    ),
    routes.rewrite(
      '/(.*)',
      '/index.html'
    ),
  ],
}
