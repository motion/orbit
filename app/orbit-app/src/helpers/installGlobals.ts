import * as React from 'react'
import * as Mobx from 'mobx'
import * as MobxUtils from 'mobx-utils'
import * as Constants from '../constants'
import * as Black from '@mcro/black'
import r2 from '@mcro/r2'
import * as Helpers from '../helpers'
import { App, Desktop, Swift, Electron } from '@mcro/stores'
import { render } from '../index'
import { color } from '@mcro/gloss'
import * as dateFns from 'date-fns'
import * as Repositories from '../repositories'
import debug from '@mcro/debug'

// add require('') to window for easy debugging
// for example require('lodash')
if (typeof __webpack_require__ !== 'undefined') {
  window['webpackData'] = __webpack_require__
  window['require'] = require('webpack-runtime-require').Require
}

// the heavy hitters
window['React'] = React
window['Constants'] = Constants
window['Mobx'] = Mobx
window['MobxUtils'] = MobxUtils
window['Constants'] = Constants
window['log'] = Black.log
window['Black'] = Black
window['r2'] = r2
window['Helpers'] = Helpers
window['App'] = App
window['Desktop'] = Desktop
window['Electron'] = Electron
window['Swift'] = Swift
window['render'] = render
window['color'] = color
window['dateFns'] = dateFns
window['debug'] = debug

for (const repo in Repositories) {
  window[repo] = Repositories[repo]
}
