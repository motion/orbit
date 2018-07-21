import '@mcro/black/mlog.js'
import * as React from 'react'
import * as Mobx from 'mobx'
import * as MobxUtils from 'mobx-utils'
import * as Constants from '../constants'
// import mobxFormatters from 'mobx-formatters'
import * as Black from '@mcro/black'
import r2 from '@mcro/r2'
import * as Helpers from '../helpers'
import { App, Desktop, Swift, Electron } from '@mcro/stores'
import { modelsList } from '@mcro/models'
import { RootStore } from '../stores/RootStore'
import { render } from '../index'
import { color } from '@mcro/gloss'

console.log('installing globals...')

// add require('') to window for easy debugging
// for example require('lodash')
window['webpackData'] = __webpack_require__
window['require'] = require('webpack-runtime-require').Require

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
window['Root'] = RootStore
window['render'] = render
window['color'] = color

modelsList.map(model => {
  window[`${model.name}`] = model
})
