// @flow
import 'babel-polyfill'
import Gloss from '@jot/black/lib/gloss'
import React from 'react'
import ReactDOM from 'react-dom'
import { IS_PROD, IS_ELECTRON, IN_TRAY } from './constants'

// all <tags /> can use $$parentStyles
React.createElement = Gloss.createElement

// splash
const Splash = require('./views/splash').default
ReactDOM.render(<Splash />, document.querySelector('#app'))
console.timeEnd('splash')

if (IS_PROD && IS_ELECTRON && !IN_TRAY) {
  // having issues requiring this in createTray. Passing it in instead
  const { remote } = require('electron')
  require('./tray').default(remote)
}

// start app
require('./start')

// accept hmr
if (module && module.hot) {
  module.hot.accept()
}
