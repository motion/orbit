// for a fast splash screen to show
// this just requires react + <Splash />

import React from 'react'
import ReactDOM from 'react-dom'

const Root = require('./views/splash').default
ReactDOM.render(<Root />, document.querySelector('#app'))
console.timeEnd('splash')

// after, require start.js to boot rest of app
require('./start')
