import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import App from 'models'
import mobx from 'mobx'
import Router from 'router'

window.React = React
window.App = App
window.Router = Router
window.mobx = mobx

export function run() {
  console.log('run')
  const Root = require('./root').default
  render(<Root />, document.querySelector('#app'))
}

App.connect().then(run)

if (module.hot) {
  module.hot.accept('./root', run)
  module.hot.accept('router', run)
}
