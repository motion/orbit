import React from 'react'
import { inject } from 'motion-view'
import { render } from 'react-dom'
import _ from 'lodash'

async function start() {
  window.React = React
  window.process = {
    browser: true,
    nextTick: x => window.setImmediate(x)
  }

  const App = require('./stores/app').default
  const Router = require('./stores/router').default

  // attach to all views/stores
  inject({
    app: App,
    router: Router,
  })

  await App.connect()

  if (process.env.NODE_ENV === 'development') {
    window._ = _
    window.App = App
    module.hot.accept()
  }

  render(
    React.createElement(require('./views').default),
    document.querySelector('#app')
  )
}

start()
