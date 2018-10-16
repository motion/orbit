import Router from '@mcro/router'
import { OrbitPage } from './pages/OrbitPage'
import { IsolatePage } from './pages/IsolatePage'
import { AppPage } from './pages/AppPage'
import { HighlightsPage } from './pages/HighlightsPage'

let AppRouter

export function runRouter() {
  AppRouter = new Router({
    routes: {
      '/': OrbitPage,
      '/app': AppPage,
      '/highlights': HighlightsPage,
      '/isolate': IsolatePage,
    },
  })
}

runRouter()

// is something you can import directly
export default AppRouter
