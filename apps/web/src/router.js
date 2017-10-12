// @flow
import Router from '@mcro/router'
import HomePage from './apps/home'
import WindowPage from './apps/window'

function runRouter() {
  return new Router({
    routes: {
      '/': HomePage,
      window: WindowPage,
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
