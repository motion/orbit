// @flow
import Router from '@mcro/router'
import HomePage from './apps/home'
import DocumentPage from './apps/document'
import ThreadPage from './apps/thread'
import InboxPage from './apps/inbox'
import DraftPage from './apps/draft'
import BarPage from './apps/bar'

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
