import React from 'react'
import ReactDOM from 'react-dom'
import App from '@jot/models'
import Mobx from 'mobx'
import MobxUtils from 'mobx-utils'
import Rx from 'rxjs'
import Router from './router'
import { IS_PROD, DB_CONFIG } from './constants'
import mobxFormatters from 'mobx-formatters'
import _ from 'lodash'
import Immutable from 'immutable'
import * as Stores from '~/stores'
import * as Constants from '~/constants'
import Splash from '~/views/splash'
import { AppContainer } from 'react-hot-loader'
import keycode from 'keycode'

if (!IS_PROD) {
  // install console formatters
  // mobxFormatters(Mobx)
  // the heavy hitters
  window.React = React
  window.App = App
  window.Constants = Constants
  window.Router = Router
  window.Mobx = Mobx
  window.MobxUtils = MobxUtils
  window.Rx = Rx
  window.Immutable = Immutable
  window._ = _
}

function errorReporter({ error }, view) {
  throw error
}

const ROOT = document.querySelector('#app')

export function render() {
  console.log('#render')
  const Root = require('./root').default
  ReactDOM.render(
    <AppContainer errorReporter={errorReporter}>
      <Root />
    </AppContainer>,
    ROOT
  )
}

if (module.hot) {
  module.hot.accept('./root', render)
  module.hot.accept('./router', render)
}

ReactDOM.render(<Splash />, ROOT)

App.start({
  database: DB_CONFIG,
  stores: Stores,
}).then(render)
