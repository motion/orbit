// @flow
import Router from '@mcro/router'
import HomePage from '~/pages/HomePage'
import DriversPage from '~/pages/DriversPage'
import MapPage from '~/pages/MapPage'

function runRouter() {
  return new Router({
    routes: {
      '/': HomePage,
      '/drivers': DriversPage,
      '/map': MapPage,
    },
  })
}

let AppRouter = runRouter()

// because doing in installDevTools would break import order
window.Router = AppRouter

export default AppRouter
