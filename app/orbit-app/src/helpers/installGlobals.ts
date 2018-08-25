import * as React from 'react'
import * as Mobx from 'mobx'
import * as Constants from '../constants'
import * as Black from '@mcro/black'
import r2 from '@mcro/r2'
import * as Helpers from '../helpers'
import { App, Desktop, Swift, Electron } from '@mcro/stores'
import { start } from '../start'
import { color } from '@mcro/gloss'
import * as dateFns from 'date-fns'
import * as Repositories from '../repositories'
import { Logger } from '@mcro/logger'

// add require('') to window for easy debugging
// for example require('lodash')
// @ts-ignore
if (typeof __webpack_require__ !== 'undefined') {
  // @ts-ignore
  window['webpackData'] = __webpack_require__
  window['require'] = require('webpack-runtime-require').Require
}

// the heavy hitters
window['React'] = React
window['Constants'] = Constants
window['Mobx'] = Mobx
window['Constants'] = Constants
window['log'] = Black.log
window['Black'] = Black
window['r2'] = r2
window['Helpers'] = Helpers
window['App'] = App
window['Desktop'] = Desktop
window['Electron'] = Electron
window['Swift'] = Swift
window['render'] = start
window['color'] = color
window['dateFns'] = dateFns
window['Logger'] = Logger

for (const repo in Repositories) {
  window[repo] = Repositories[repo]
}
