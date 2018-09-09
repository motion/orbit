import Router from '@mcro/router'
import { OrbitPage } from './apps/OrbitPage'
import { IsolatePage } from './apps/IsolatePage'
import { AppPage } from './apps/AppPage'

let AppRouter

export function runRouter() {
  AppRouter = new Router({
    routes: {
      '/': OrbitPage,
      '/app': AppPage,
      '/isolate': IsolatePage,
    },
  })
}

runRouter()

// is something you can import directly
export default AppRouter
