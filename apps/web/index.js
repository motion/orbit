import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { inject } from 'my-decorators'

const DEV_MODE = process.env.NODE_ENV === 'development'

// process polyfill
window.process = {
  browser: true,
  nextTick: (cb) => window.setImmediate(cb),
}

async function start() {
  // dev helpers
  if (DEV_MODE) {
    window._ = _
    window.React = React
    window.App = App
  }

  // global injections for all views/stores
  inject({
    get app() { return App },
    get router() { return Router },
  })

  const App = require('./stores/app').default
  const Router = require('./stores/router').default

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
