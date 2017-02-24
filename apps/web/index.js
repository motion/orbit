import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { view } from 'helpers'

const DEV_MODE = process.env.NODE_ENV === 'development'

// process polyfill
window.React = React
window.process = {
  browser: true,
  nextTick: (cb) => window.setImmediate(cb),
}

async function start() {
  // global injections for all views/stores
  view.inject({
    get app() { return App },
    get router() { return Router },
  })

  const App = require('./stores/app').default
  const Router = require('./stores/router').default

  // dev helpers
  if (DEV_MODE) {
    window._ = _
    window.App = App
  }

  // connect to db
  await App.connect()

  // then get views
  const Views = require('./views').default

  ReactDOM.render(
    <Views />,
    document.querySelector('#app')
  )

  if (DEV_MODE && module.hot) {
    module.hot.accept()
  }
}

start()
