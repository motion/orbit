import React from 'react'
import { render } from 'react-dom'
import _ from 'lodash'
import { inject } from 'helpers'

async function start() {
  window.React = React
  window.process = { browser: true, nextTick: x => window.setImmediate(x) }

  const App = require('./stores/app').default
  const Router = require('./stores/router').default

  await App.connect()

  inject({
    app: App,
    router: Router,
  })

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
