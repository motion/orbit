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

import * as Black from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'
import { color } from '@mcro/gloss'
import { stringify } from '@mcro/helpers'
import { LoggerSettings } from '@mcro/logger'
import * as Repositories from '@mcro/model-bridge'
import * as Models from '@mcro/models'
import r2 from '@mcro/r2'
import { App, Desktop, Electron } from '@mcro/stores'
import { PopoverState } from '@mcro/ui'
import * as dateFns from 'date-fns'
import * as Mobx from 'mobx'
import * as React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { AppActions } from '../actions/AppActions'
import * as Constants from '../constants'
import * as Helpers from '../helpers'

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
window['PopoverState'] = PopoverState
window['React'] = React
window['Constants'] = Constants
window['Mobx'] = Mobx
window['Config'] = getGlobalConfig()
window['log'] = Black.log
window['Black'] = Black
window['r2'] = r2
window['Helpers'] = Helpers
window['App'] = App
window['Desktop'] = Desktop
window['Electron'] = Electron
window['color'] = color
window['dateFns'] = dateFns
window['LoggerSettings'] = LoggerSettings
window['toJS'] = toJS
window['stringify'] = stringify
window['AppActions'] = AppActions
window['Models'] = Models
window['sherlockjs'] = require('sherlockjs')

const fastCompare = require('react-fast-compare')
window['reactFastCompareDebug'] = (a, b) => {
  for (const key in a) {
    if (!fastCompare(a[key], b[key])) {
      console.log('falsy value', key)
      return false
    }
  }
  return true
}

// make the various model/repositories global
for (const repo in Repositories) {
  window[repo] = Repositories[repo]
}
