import React from 'react'
import ReactDOM from 'react-dom'
import App from '@jot/models'
import Mobx from 'mobx'
import _m from 'mobx-utils'
import Rx from 'rxjs'
import Router from './router'
import { IS_PROD, DB_CONFIG } from './constants'
import mobxFormatters from 'mobx-formatters'
import _ from 'lodash'
import * as Stores from '~/stores'
import * as Constants from '~/constants'
import Splash from '~/views/splash'

if (!IS_PROD) {
  // install console formatters
  // mobxFormatters(Mobx)
  // dev helpers
  window.React = React
  window.App = App
  window.Constants = Constants
  window.Router = Router
  window.Mobx = Mobx
  window.Rx = Rx
  window._m = _m
  window._ = _
}

const ROOT = document.querySelector('#app')

function render() {
  const Root = require('./root').default
  ReactDOM.render(<Root />, ROOT)
}

if (module.hot) {
  module.hot.accept('./root', render)
  module.hot.accept('./router', render)
}

ReactDOM.render(<Splash />, ROOT)
App.start(DB_CONFIG, Stores).then(render)
