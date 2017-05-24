import Router from 'motion-mobx-router'
import { render } from './index'

let AppRouter

// const context = require.context && require.context('./pages', false, /\.js$/)

const getRoutes = context => ({
  '/': require('./pages/home.js').default,
  '/feed': require('./pages/feed.js').default,
  '/templates': require('./pages/templates.js').default,
  '/todo': require('./pages/todo.js').default,
  'g/:slug(/:hashtag)': require('./pages/place.js').default,
  'd/:id': require('./pages/doc.js').default,
})

function start() {
  AppRouter = new Router({ routes: getRoutes() })
}

// for hmr
if (module.hot) {
  module.hot.accept((...args) => {
    // const newContext = require.context('./pages', false, /\.js$/)
    console.log('ACCEPT', newContext)
    start()
    render()
  })
}

start()

export default AppRouter
