import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

const DEV_MODE = process.env.NODE_ENV === 'development'

window.process = { browser: true }

async function start() {
  const App = require('./stores/app').default

  // dev helpers
  if (DEV_MODE) {
    window._ = _
    window.React = React
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
