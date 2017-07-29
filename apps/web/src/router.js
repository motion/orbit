// @flow
import Router from '@mcro/router'
import HomePage from './pages/home'
import DocumentPage from './pages/document'
import ThreadPage from './pages/thread'
import InboxPage from './pages/inbox'
import DraftPage from './pages/draft'
import BarPage from './pages/bar'

let AppRouter

function runRouter() {
  AppRouter = new Router({
    routes: {
      '/': HomePage,
      'document/:id': DocumentPage,
      'thread/:id': ThreadPage,
      'inbox/:id': InboxPage,
      '(document)(thread)(inbox)/:id/draft': DraftPage,
      bar: BarPage,
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
  })
}

runRouter()

export default AppRouter
