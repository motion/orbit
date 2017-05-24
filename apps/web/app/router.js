import Router from 'motion-mobx-router'
import { render } from './index'

let AppRouter

const context = require.context('./pages', false, /\.js$/)

const getRoutes = context => ({
  '/': context('./home.js').default,
  '/feed': context('./feed.js').default,
  '/templates': context('./templates.js').default,
  '/todo': context('./todo.js').default,
  'g/:slug(/:hashtag)': context('./place.js').default,
  'd/:id': context('./doc.js').default,
})

function start(context) {
  AppRouter = new Router({ routes: getRoutes(context) })
}

// for hmr
if (module.hot) {
  module.hot.accept(context.id, (...args) => {
    const newContext = require.context('./pages', false, /\.js$/)
    console.log('ACCEPT', newContext)
    start(newContext)
    render()
  })
}

start(context)

export default AppRouter
