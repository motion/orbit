// @flow
import Router from 'mo-router'
import { start } from './start'

let AppRouter

const getRoutes = () => ({
  '/': require('./pages/doc.js').default,
  'd/:id': require('./pages/doc.js').default,
  '/popovers': require('./pages/popovers.js').default,
})

function runRouter() {
  AppRouter = new Router({ routes: getRoutes() })
  // because doing in installDevTools would break import orders
  window.Router = AppRouter
}

// for hmr
if (module.hot) {
  module.hot.accept(() => {
    console.log('accept router')
    runRouter()
    start(true)
  })
}

runRouter()

export default AppRouter
