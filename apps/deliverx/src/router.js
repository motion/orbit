// @flow
import Router from '@mcro/router'
import HomePage from '~/pages/HomePage'
import MapPage from '~/pages/MapPage'

function runRouter() {
  return new Router({
    routes: {
      '/': HomePage,
      '/map': MapPage,
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
