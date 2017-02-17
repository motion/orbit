import React from 'react'
import { render } from 'react-dom'
import _ from 'lodash'
import App from './stores/app'

const DEV_MODE = process.env.NODE_ENV === 'development'

async function start() {
  // dev helpers
  if (DEV_MODE) {
    window._ = _
    window.React = React
  }
  // connect to db
  await App.connect()
  // now get views
  const Views = require('./views').default
  // random key to trigger HMR
  render(
    <Views key={Math.random()} />,
    document.querySelector('#app')
  )

  if (DEV_MODE && module.hot) {
    module.hot.accept()
  }
}

start()
