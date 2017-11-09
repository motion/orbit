// @flow
import Router from '@mcro/router'
import SettingsPage from './apps/settings'
import AuthPage from './apps/auth'
import OraPage from './apps/ora'
import CrawlerPage from './apps/crawler'

function runRouter() {
  return new Router({
    routes: {
      settings: SettingsPage,
      authorize: AuthPage,
      ora: OraPage,
      testCrawler: CrawlerPage,
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
