// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
import { Mediator } from '@o/bridge'
import { toColor } from '@o/color'
import { getGlobalConfig } from '@o/config'
import { themes } from '@o/kit'
import { LoggerSettings } from '@o/logger'
import * as Models from '@o/models'
import { App, Desktop, Electron } from '@o/stores'
import { PopoverState } from '@o/ui'
import * as dateFns from 'date-fns'
import { css } from 'gloss'
import * as Mobx from 'mobx'
import page from 'page'
import * as React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'

import { AppActions } from '../actions/AppActions'
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import { log } from './log'

// dont import app level stuff in here
// it will break hmr

// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️

// add require('') to window for easy debugging
// for example require('lodash')
window['require'] = require('webpack-runtime-require').Require

const toJS = obj => {
  const next = Mobx.toJS(obj)
  if (Array.isArray(next)) {
    return next.map(toJS)
  }
  return next
}

window['page'] = page
window['css'] = css
window['ReconnectingWebSocket'] = ReconnectingWebSocket
window['Mediator'] = Mediator
window['PopoverState'] = PopoverState
window['React'] = React
window['Constants'] = Constants
window['Mobx'] = Mobx
window['Config'] = getGlobalConfig()
window['log'] = log
window['Helpers'] = Helpers
window['App'] = App
window['Desktop'] = Desktop
window['Electron'] = Electron
window['toColor'] = toColor
window['dateFns'] = dateFns
window['LoggerSettings'] = LoggerSettings
window['toJS'] = toJS
window['stringify'] = JSON.stringify.bind(JSON)
window['AppActions'] = AppActions
window['Models'] = Models
window['Themes'] = themes

const { isEqual } = require('@o/fast-compare')
window['isEqualDebug'] = (a, b) => {
  for (const key in a) {
    if (!isEqual(a[key], b[key])) {
      console.log('falsy value', key)
      return false
    }
  }
  return true
}
