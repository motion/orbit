import { Router } from '@mcro/router'
import { OrbitPage } from './pages/OrbitPage/OrbitPage'
import { AppPage } from './pages/AppPage/AppPage'
import { ChromePage } from './pages/ChromePage/ChromePage'

export const router = new Router({
  routes: {
    '/': OrbitPage,
    '/app': AppPage,
    '/chrome': ChromePage,
  },
})
