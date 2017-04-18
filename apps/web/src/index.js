import React from 'react'
import { render } from 'react-dom'
import App from 'models'
import mobx from 'mobx'
import Router from 'router'

window.React = React
window.App = App
window.Router = Router
window.mobx = mobx

function run() {
  const Root = require('./root').default
  render(<Root />, document.querySelector('#app'))
}

App.connect().then(run)

if (module.hot) {
  module.hot.accept('./root', run)
  module.hot.accept('models', () => {
    require('models').connect().then(run)
  })
}
