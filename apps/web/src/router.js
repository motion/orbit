// @flow
import Router from '@mcro/router'
import HomePage from './apps/home'
import WindowPage from './apps/window'
import AuthPage from './apps/auth'
import OraPage from './apps/ora'

function runRouter() {
  return new Router({
    routes: {
      '/': HomePage,
      settings: AuthPage,
      window: WindowPage,
      ora: OraPage,
    },
  })
}

let AppRouter = runRouter()

// because doing in installDevTools would break import order
window.Router = AppRouter

// for hmr
if (module.hot) {
  module.hot.accept(() => {
    AppRouter = runRouter()
    window.App.render()
  })
}

export default AppRouter
