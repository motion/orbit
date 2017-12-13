// @flow
import 'babel-polyfill'
import 'isomorphic-fetch'
import createElement from '@mcro/black/lib/createElement'
// dont do * as React, we need to overwrite createElement
import React from 'react'
import ReactDOM from 'react-dom'
import * as Constants from './constants'
import debug from 'debug'

// $FlowIgnore
React.createElement = createElement // any <tag /> can use $$style

if (Constants.IS_PROD) {
  require('./helpers/installProd')
} else {
  require('./helpers/installDevTools')
}

const DEBUG_FLAG = localStorage.getItem('debug') || 'app,sync,model'
debug.enable(DEBUG_FLAG)

function splash() {
  const Splash = require('./views/splash').default
  ReactDOM.render(<Splash />, document.querySelector('#app'))
}

export function start() {
  // splash()
  console.timeEnd('splash')
  require('./app')
}

if (!window.started) {
  window.started = true
  start()
}

// accept hmr
if (module && module.hot) {
  const restart = () => {
    require('./app').start(true)
  }
  module.hot.accept(restart)
  module.hot.accept('@mcro/models', restart)
}
