import React from 'react'
import ReactDOM from 'react-dom'
import App from '@jot/models'
import * as RxDB from 'rxdb'
import Mobx from 'mobx'
import MobxUtils from 'mobx-utils'
import Rx from 'rxjs'
import Router from '~/router'
import PouchDB from 'pouchdb-core'
import { IS_PROD, DB_CONFIG } from './constants'
import mobxFormatters from 'mobx-formatters'
import _ from 'lodash'
import Immutable from 'immutable'
import * as Constants from '~/constants'
import { ThemeProvide } from 'gloss'
import themes from './theme'
// import serviceWorker from './helpers/serviceWorker'
// serviceWorker()

// Mobx.useStrict(true)

if (!IS_PROD) {
  // install console formatters
  mobxFormatters(Mobx)
  // the heavy hitters
  window.React = React
  window.App = App
  window.Constants = Constants
  window.Router = Router
  window.Mobx = Mobx
  window.MobxUtils = MobxUtils
  window.RxDB = RxDB
  window.Rx = Rx
  window.Immutable = Immutable
  window.PouchDB = PouchDB
  window._ = _
}

function errorReporter({ error }, view) {
  throw error
}

const ROOT = document.querySelector('#app')

export function render() {
  console.time('#render')
  const Root = require('./views/root').default
  ReactDOM.render(
    <ThemeProvide {...themes}>
      <Root />
    </ThemeProvide>,
    ROOT
  )
  console.timeEnd('#render')
}

async function start() {
  await App.start({
    database: DB_CONFIG,
  })
  render()
}

if (module.hot) {
  module.hot.accept('./views/root', render)
  module.hot.accept('./router', render)
  module.hot.accept('@jot/models', start)
}

start()
