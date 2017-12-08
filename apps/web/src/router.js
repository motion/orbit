// @flow
import Router from '@mcro/router'
import SettingsPage from './apps/settings'
import AuthPage from './apps/auth'
import PeekPage from './apps/peek'
import OraPage from './apps/ora'
import RelevancyPage from './apps/relevancy'

function runRouter() {
  return new Router({
    routes: {
      '/': OraPage,
      settings: SettingsPage,
      relevancy: RelevancyPage,
      auth: AuthPage,
      peek: PeekPage,
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
