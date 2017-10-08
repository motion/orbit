// @flow
import 'babel-polyfill'
import 'isomorphic-fetch'
import createElement from '@mcro/black/lib/createElement'
import * as React from 'react'
import ReactDOM from 'react-dom'
import * as Constants from './constants'
import '@mcro/models/lib/user' // start user connect immediately
import debug from 'debug'

if (Constants.IS_PROD) {
  require('./helpers/installProd')
} else {
  require('./helpers/installDevTools')
}

const DEBUG_FLAG = localStorage.getItem('debug') || 'app,sync,model'
debug.enable(DEBUG_FLAG)

// $FlowIgnore
React.createElement = createElement // any <tag /> can use $$style

function splash() {
  const Splash = require('./views/splash').default
  ReactDOM.render(<Splash />, document.querySelector('#app'))
  console.timeEnd('splash')
}

function main() {
  splash()
  require('./app')
}

if (!window.started) {
  window.started = true
  main()
}

// accept hmr
if (module && module.hot) {
  const restart = () => require('./app').start(true)
  module.hot.accept(restart)
  module.hot.accept('@mcro/models', restart)
}
