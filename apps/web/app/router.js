// @flow
import Router from 'motion-mobx-router'
import { render } from './start'

let AppRouter

const getRoutes = context => ({
  '/': require('./pages/home.js').default,
  '/popovers': require('./pages/popovers.js').default,
  'd/:id': require('./pages/doc.js').default,
})

function start() {
  AppRouter = new Router({ routes: getRoutes() })
}

// for hmr
if (module.hot) {
  module.hot.accept((...args) => {
    start()
    render()
  })
}

start()

export default AppRouter
