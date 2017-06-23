// @flow
import Router from 'motion-mobx-router'
import { render } from './start'

let AppRouter

const getRoutes = () => ({
  // '/': require('./pages/home.js').default,
  '/popovers': require('./pages/popovers.js').default,
  '/': require('./pages/doc.js').default,
  'd/:id': require('./pages/doc.js').default,
})

function start() {
  AppRouter = new Router({ routes: getRoutes() })
  // because doing in installDevTools would break import orders
  window.Router = AppRouter
}

// for hmr
if (module.hot) {
  module.hot.accept(() => {
    console.log('accept router')
    start()
    render()
  })
}

start()

export default AppRouter
