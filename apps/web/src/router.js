// @flow
import Router from '@mcro/router'
import HomePage from './apps/home'
import BarPage from './apps/bar'
import EmptyPage from './apps/empty'
import MasterDetailPage from './apps/masterDetail'
import SettingsPage from './apps/settings'

function runRouter() {
  return new Router({
    routes: {
      '/': HomePage,
      '/vibrancy': EmptyPage,
      bar: BarPage,
      master: MasterDetailPage,
      settings: SettingsPage,
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
