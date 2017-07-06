// @flow
import 'babel-polyfill'
// import 'react-hot-loader/patch'
import { createElement } from '@mcro/black'
import React from 'react'
import ReactDOM from 'react-dom'
import * as Constants from './constants'

// to start superlogin connection immediately
import '@mcro/models/lib/user'

if (Constants.IS_PROD) {
  require('./helpers/installProd')
} else {
  require('./helpers/installDevTools')
}

window.React = React // fine for now
React.createElement = createElement // any <tag /> can use $$style

function splash() {
  const Splash = require('./views/splash').default
  ReactDOM.render(<Splash />, document.querySelector('#app'))
  console.timeEnd('splash')
}

if (Constants.IS_ELECTRON && !Constants.IN_TRAY) {
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
    require('./start').start(true)
  })
}
