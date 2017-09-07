// @flow
import Router from '@mcro/router'
import HomePage from './apps/home'
import BarPage from './apps/bar'
import EmptyPage from './apps/empty'
import MasterDetailPage from './apps/masterDetail'
import SettingsPage from './apps/settings'
import { render } from './start'

let AppRouter

function runRouter() {
  AppRouter = new Router({
    routes: {
      '/': HomePage,
      '/vibrancy': EmptyPage,
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
    runRouter()
    render()
  })
}

runRouter()

export default AppRouter
