import Router from '@mcro/router'
import { AuthPage } from '~/apps/AuthPage'
import { MainPage } from '~/apps/MainPage'

let AppRouter

export function runRouter() {
  AppRouter = new Router({
    routes: {
      '/': MainPage,
      '/auth': AuthPage,
    },
  })
  window.Router = AppRouter
}

runRouter()

export default AppRouter
