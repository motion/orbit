import React from 'react'
import ReactDOM from 'react-dom'
import App from 'models'
import Mobx from 'mobx'
import Router from './router'
import { IS_PROD, DB_CONFIG } from './constants'
import mobxFormatters from 'mobx-formatters'
import _ from 'lodash'
import * as Stores from '~/stores'
import * as Constants from '~/constants'

if (!IS_PROD) {
  // install console formatters
  // mobxFormatters(Mobx)
  // dev helpers
  window.React = React
  window.App = App
  window.Constants = Constants
  window.Router = Router
  window.Mobx = Mobx
  window._ = _
}

function render() {
  const Root = require('./root').default
  ReactDOM.render(<Root />, document.querySelector('#app'))
}

export function start() {
  App.start(DB_CONFIG, Stores).then(render)
}

if (module.hot) {
  module.hot.accept('./root', render)
  module.hot.accept('./router', render)
}

start()
