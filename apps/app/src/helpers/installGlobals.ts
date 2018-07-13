import '@mcro/black/mlog.js'
import * as React from 'react'
import * as Mobx from 'mobx'
import * as MobxUtils from 'mobx-utils'
import * as Constants from '../constants'
// import mobxFormatters from 'mobx-formatters'
import * as Black from '@mcro/black'
import r2 from '@mcro/r2'
import * as Helpers from '../helpers'

// add require('') to window for easy debugging
// for example require('lodash')
// @ts-ignore
window.webpackData = __webpack_require__
// @ts-ignore
window.require = require('webpack-runtime-require').Require

// the heavy hitters
// @ts-ignore
window.React = React
// @ts-ignore
window.Constants = Constants
// @ts-ignore
window.Mobx = Mobx
// @ts-ignore
window.MobxUtils = MobxUtils
// @ts-ignore
window.Constants = Constants
// @ts-ignore
window.log = Black.log
// @ts-ignore
window.Black = Black
// @ts-ignore
window.r2 = r2
// @ts-ignore
window.Helpers = Helpers
