import * as React from 'react'
import * as Mobx from 'mobx'
import * as Constants from '../constants'
import * as Black from '@mcro/black'
import r2 from '@mcro/r2'
import * as Helpers from '../helpers'
import { App, Desktop, Electron } from '@mcro/stores'
import { start } from '../start'
import { color } from '@mcro/gloss'
import * as dateFns from 'date-fns'
import * as Repositories from '@mcro/model-bridge'
import { LoggerSettings } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { Actions } from '../actions/Actions'
import { stringify } from '@mcro/helpers'
import * as Models from '@mcro/models'

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
window['render'] = start
window['color'] = color
window['dateFns'] = dateFns
window['LoggerSettings'] = LoggerSettings
window['toJS'] = toJS
window['stringify'] = stringify
window['Actions'] = Actions
window['Mediator'] = Repositories.Mediator
window['Models'] = Models
window['sherlockjs'] = require('sherlockjs')

// make the various model/repositories global
for (const repo in Repositories) {
  window[repo] = Repositories[repo]
}
