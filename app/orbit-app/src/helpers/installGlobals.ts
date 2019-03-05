// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️

// dont import app level stuff in here
// it will break hmr

// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️

import { Mediator } from '@mcro/bridge'
import { getGlobalConfig } from '@mcro/config'
import { color } from '@mcro/gloss'
import { LoggerSettings } from '@mcro/logger'
import * as Models from '@mcro/models'
import r2 from '@mcro/r2'
import { App, Desktop, Electron } from '@mcro/stores'
import { PopoverState } from '@mcro/ui'
import * as dateFns from 'date-fns'
import * as Mobx from 'mobx'
import * as React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { AppActions } from '../actions/appActions/AppActions'
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import { log } from './log'

// add require('') to window for easy debugging
// for example require('lodash')
// @ts-ignore
if (typeof __webpack_require__ !== 'undefined') {
  // @ts-ignore
  window['webpackData'] = __webpack_require__
  window['require'] = require('webpack-runtime-require').Require
}

const toJS = obj => {
  const next = Mobx.toJS(obj)
  if (Array.isArray(next)) {
    return next.map(toJS)
  }
  return next
}

// the heavy hitters
window['ReconnectingWebSocket'] = ReconnectingWebSocket
window['Mediator'] = Mediator
window['PopoverState'] = PopoverState
window['React'] = React
window['Constants'] = Constants
window['Mobx'] = Mobx
window['Config'] = getGlobalConfig()
window['log'] = log
window['r2'] = r2
window['Helpers'] = Helpers
window['App'] = App
window['Desktop'] = Desktop
window['Electron'] = Electron
window['color'] = color
window['dateFns'] = dateFns
window['LoggerSettings'] = LoggerSettings
window['toJS'] = toJS
window['stringify'] = JSON.stringify.bind(JSON)
window['AppActions'] = AppActions
window['Models'] = Models

const { isEqual } = require('@mcro/fast-compare')
window['isEqualDebug'] = (a, b) => {
  for (const key in a) {
    if (!isEqual(a[key], b[key])) {
      console.log('falsy value', key)
      return false
    }
  }
  return true
}
