// for a fast splash screen to show
// this just requires react + <Splash />

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

// after, require start.js to boot rest of app
window.restart = require('./start')

module && module.hot && module.hot.accept()
