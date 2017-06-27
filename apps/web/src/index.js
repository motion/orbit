// @flow
import 'babel-polyfill'
// import 'react-hot-loader/patch'
import { createElement } from '@jot/black'
import React from 'react'
import ReactDOM from 'react-dom'
import { IS_PROD, IS_ELECTRON, IN_TRAY } from './constants'

if (!IS_PROD) {
  require('./helpers/installDevTools')
}

// all <tags /> can use $$parentStyles
React.createElement = createElement

function splash() {
  const Splash = require('./views/splash').default
  ReactDOM.render(<Splash />, document.querySelector('#app'))
  console.timeEnd('splash')
}

if (IS_PROD && IS_ELECTRON && !IN_TRAY) {
  // // having issues requiring this in createTray. Passing it in instead
  // const { remote } = require('electron')
  // require('./tray').default(remote)
}

// start app
splash()
require('./start')

// accept hmr
if (module && module.hot) {
  module.hot.accept(() => {
    log('accept: ./index.js')
    // require('./start').start(true)
  })
}
