import Router from '@mcro/router'
import { AuthPage } from './apps/AuthPage'
import { MainPage } from './apps/MainPage'
import { IsolatePage } from './apps/IsolatePage'

let AppRouter

export function runRouter() {
  AppRouter = new Router({
    routes: {
      '/': MainPage,
      '/auth': AuthPage,
      '/isolate': IsolatePage,
    },
  })
  window.Router = AppRouter
}

runRouter()

export default AppRouter
