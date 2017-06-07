// @flow
// for a fast splash screen to show
// this just requires react + <Splash />

import 'regenerator-runtime/runtime'
import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Gloss from '~/helpers/styles'

// allow any <tag /> to use our $$parent styles
React.createElement = Gloss.createElement

const Root = require('./views/splash').default
ReactDOM.render(<Root />, document.querySelector('#app'))
console.timeEnd('splash')

// polyfills
window.Buffer = require('buffer/').Buffer

// BOOT
window.restart = require('./start').start

// hmr
module && module.hot && module.hot.accept()
