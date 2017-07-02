// @flow
import Router from '@mcro/router'
import { start } from './start'

let AppRouter

const getRoutes = () => ({
  '/': require('./pages/homePage.js').default,
  'd/:id': require('./pages/docPage.js').default,
  '/test': require('./pages/testPage.js').default,
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
