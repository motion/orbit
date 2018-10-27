import { Router } from '@mcro/router'
import { OrbitPage } from './pages/OrbitPage/OrbitPage'
import { AppPage } from './pages/AppPage/AppPage'
import { HighlightsPage } from './pages/HighlightsPage/HighlightsPage'

export const router = new Router({
  routes: {
    '/': OrbitPage,
    '/app': AppPage,
    '/highlights': HighlightsPage,
  },
})
