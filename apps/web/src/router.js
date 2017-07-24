// @flow
import Router from '@mcro/router'
import { start } from './start'

let AppRouter

const getRoutes = () => ({
  '/': require('./pages/home').default,
  'document/:id': require('./pages/document').default,
  'thread/:id': require('./pages/thread').default,
  'inbox/:id': require('./pages/inbox').default,
})

function runRouter() {
  AppRouter = new Router({ routes: getRoutes() })
  // because doing in installDevTools would break import orders
  window.Router = AppRouter
}

// for hmr
if (module.hot) {
  module.hot.accept(() => {
    log('accept: ./router.js')
    // runRouter()
    // start(true)
  })
}

runRouter()

export default AppRouter
