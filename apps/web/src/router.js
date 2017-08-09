// @flow
import Router from '@mcro/router'
import HomePage from './apps/home'
import DocumentPage from './apps/document'
import ThreadPage from './apps/thread'
import InboxPage from './apps/inbox'
import DraftPage from './apps/draft'
import BarPage from './apps/bar'
import MasterDetailPage from './apps/masterDetail'
import { render } from './start'

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
      master: MasterDetailPage,
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
