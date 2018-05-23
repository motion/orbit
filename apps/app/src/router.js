import Router from '@mcro/router'
import { AuthPage } from '~/apps/AuthPage'
import { MainPage } from '~/apps/MainPage'

function runRouter() {
  return new Router({
    routes: {
      '/': MainPage,
      '/auth': AuthPage,
    },
  })
}

let AppRouter = runRouter()

// because doing in installDevTools would break import order
window.Router = AppRouter

export default AppRouter
