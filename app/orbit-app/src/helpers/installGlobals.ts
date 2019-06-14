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
import global from 'global'
import { css } from 'gloss'
import * as GlossTheme from 'gloss-theme'
import * as Mobx from 'mobx'
import page from 'page'
import * as React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'

import * as OrbitApps from '../apps/orbitApps'
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
global.require = require('webpack-runtime-require').Require

const toJS = obj => {
  const next = Mobx.toJS(obj)
  if (Array.isArray(next)) {
    return next.map(toJS)
  }
  return next
}

global.page = page
global.css = css
global.ReconnectingWebSocket = ReconnectingWebSocket
global.Mediator = Mediator
global.PopoverState = PopoverState
global.React = React
global.Constants = Constants
global.Mobx = Mobx
global.Config = getGlobalConfig()
global.log = log
global.Helpers = Helpers
global.App = App
global.Desktop = Desktop
global.Electron = Electron
global.toColor = toColor
global.dateFns = dateFns
global.LoggerSettings = LoggerSettings
global.toJS = toJS
global.stringify = JSON.stringify.bind(JSON)
global.Models = Models
global.Themes = themes
global.OrbitApps = OrbitApps
global.GlossTheme = GlossTheme

const { isEqual } = require('@o/fast-compare')
global.isEqualDebug = (a, b) => {
  for (const key in a) {
    if (!isEqual(a[key], b[key])) {
      console.log('falsy value', key)
      return false
    }
  }
  return true
}
