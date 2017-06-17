// @flow

// polyfills
window.Buffer = require('buffer/').Buffer
import 'regenerator-runtime/runtime'
import 'babel-polyfill'
import Gloss from '@jot/black/lib/gloss'
// all <tags /> can use $$parentStyles
React.createElement = Gloss.createElement

// for a fast splash screen to show
import React from 'react'
import ReactDOM from 'react-dom'
import { IS_ELECTRON, IN_TRAY } from './constants'

// <Splash />
const Root = require('./views/splash').default
ReactDOM.render(<Root />, document.querySelector('#app'))
console.timeEnd('splash')

if (IS_ELECTRON && !IN_TRAY) {
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
