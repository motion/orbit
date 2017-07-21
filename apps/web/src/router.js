// @flow
import Router from '@mcro/router'
import { start } from './start'

let AppRouter

const getRoutes = () => ({
  '/': require('./views/homePage').default,
  'doc/:id': require('./views/document').default,
  'thread/:id': require('./views/thread').default,
  'inbox/:id': require('./views/inbox').default,
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
    runRouter()
    start(true)
  })
}

runRouter()

export default AppRouter
