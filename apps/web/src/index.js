// @flow
import 'babel-polyfill'
import createElement from '@mcro/black/lib/createElement'
import * as React from 'react'
import ReactDOM from 'react-dom'
import * as Constants from './constants'
import '@mcro/models/lib/user' // start superlogin connect immediately
import Path from 'path'

export const indexFile = Path.join(__dirname, '..', 'index.html')

if (Constants.IS_PROD) {
  require('./helpers/installProd')
} else {
  require('./helpers/installDevTools')
}

// $FlowIgnore
React.createElement = createElement // any <tag /> can use $$style

function splash() {
  const Splash = require('./views/splash').default
  ReactDOM.render(<Splash />, document.querySelector('#app'))
  console.timeEnd('splash')
}

function main() {
  splash()
  const App = require('./app').default
  const app = new App()
  app.start()
  window.App = app
  return app
}

export let App = main()

// accept hmr
if (module && module.hot) {
  module.hot.accept(_ => _)
  module.hot.accept('@mcro/models', () => {
    if (App) {
      App.dispose()
      App = main()
    }
  })
}
