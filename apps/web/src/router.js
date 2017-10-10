// @flow
import Router from '@mcro/router'
import HomePage from './apps/home'
import WindowPage from './apps/windowDetail'
import SettingsPage from './apps/settings'

function runRouter() {
  return new Router({
    routes: {
      '/': HomePage,
      window: WindowPage,
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
