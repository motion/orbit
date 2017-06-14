// @flow
// for a fast splash screen to show
// this just requires react + <Splash />

import 'regenerator-runtime/runtime'
import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Gloss from '@jot/black/lib/gloss'
import createTray from './tray'
import { IS_ELECTRON, IN_TRAY } from './constants'

// allow any <tag /> to use our $$parent styles
React.createElement = Gloss.createElement

const Root = require('./views/splash').default

ReactDOM.render(<Root />, document.querySelector('#app'))

console.timeEnd('splash')

// polyfills
window.Buffer = require('buffer/').Buffer

if (IS_ELECTRON && !IN_TRAY) {
  // having issues requiring this in createTray. Passing it in instead
  const { remote } = window.require('electron')
  createTray(remote)
}
// BOOT
require('./start')

// hmr
module && module.hot && module.hot.accept()
