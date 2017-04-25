import React from 'react'
import { render } from 'react-dom'
import App from 'models'
import mobx from 'mobx'
import Router from './router'
import { DB_CONFIG } from './constants'
import mobxFormatters from 'mobx-formatters'

// install console formatters
mobxFormatters(mobx)

window.React = React
window.App = App
window.Router = Router
window.mobx = mobx

export function run() {
  const Root = require('./root').default
  render(<Root />, document.querySelector('#app'))
}

App.start(DB_CONFIG).then(run)

if (module.hot) {
  module.hot.accept('./root', run)
  module.hot.accept('./router', run)
}
