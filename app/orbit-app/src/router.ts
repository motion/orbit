import { Router } from '@mcro/router'
import { OrbitPage } from './pages/OrbitPage/OrbitPage'
import { AppPage } from './pages/AppPage/AppPage'

export const router = new Router({
  routes: {
    '/': OrbitPage,
    '/app': AppPage,
  },
})
