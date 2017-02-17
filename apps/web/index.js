import React from 'react'
import { render } from 'react-dom'
import Router from 'motion-router'
import _ from 'lodash'
import App from './stores/app'

console.log(Router)

async function start() {
  // dev helpers
  if (process.env.NODE_ENV === 'development') {
    window._ = _
    window.React = React
  }

  // connect to db
  await App.connect()

  const Views = require('./views').default
  const routes = require('./routes').default
  const router = new Router({ routes })

  App.router = router

  // random key to trigger HMR
  render(
    <Views router={router} key={Math.random()} />,
    document.querySelector('#app')
  )

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

start()
