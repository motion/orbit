// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
// ⚠️ ️
import { Mediator } from '@o/bridge'
import { toColor } from '@o/color'
import { getGlobalConfig } from '@o/config'
import * as Kit from '@o/kit'
import { isEqualDebug } from '@o/libs'
import { LoggerSettings } from '@o/logger'
import * as Models from '@o/models'
import { App, Desktop, Electron } from '@o/stores'
import * as UI from '@o/ui'
import * as dateFns from 'date-fns'
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

const global = window as any

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
global.UI = UI
global.Kit = Kit
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
global.OrbitApps = OrbitApps
global.GlossTheme = GlossTheme
global.isEqualDebug = isEqualDebug
