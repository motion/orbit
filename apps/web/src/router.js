// @flow
import Router from '@mcro/router'
import HomePage from './apps/home'
import BarPage from './apps/bar'
import MasterDetailPage from './apps/masterDetail'
import SettingsPage from './apps/settings'
import { render } from './start'

let AppRouter

function runRouter() {
  AppRouter = new Router({
    routes: {
      '/': HomePage,
      bar: BarPage,
      master: MasterDetailPage,
      settings: SettingsPage,
    },
  })
  // because doing in installDevTools would break import order
  window.Router = AppRouter
}

// for hmr
if (module.hot) {
  module.hot.accept(() => {
    log('accept: ./router.js')
    runRouter()
    render()
  })
}

runRouter()

export default AppRouter
