// 🐛 note: dont import router or app here
// it causes the entire app to be imported before boot
import '@mcro/black/mlog.js'
import * as React from 'react'
import * as Mobx from 'mobx'
import * as MobxUtils from 'mobx-utils'
import * as Constants from '~/constants'
// import mobxFormatters from 'mobx-formatters'
import * as Black from '@mcro/black'
import r2 from '@mcro/r2'
import * as Helpers from '~/helpers'
import debug from '@mcro/debug'

// lets log loudly by default
console.log(
  'In dev mode, setting debug.loud() by default. Call debug.quiet() to turn down logs',
)
debug.loud()

// add require('') to window for easy debugging
// for example require('lodash')
window.webpackData = __webpack_require__
window.require = require('webpack-runtime-require').Require

// should enable eventually for safer mobx
// really should be even safer with automagical to enforce same-store only actions
// Mobx.useStrict(true)

// install console formatters
// mobxFormatters(Mobx)

console.warn(
  'WARNING! console.warn is patched because Electron spits out 3 pages of warnings initially... need to patch before prod',
)
const ogWarn = console.warn.bind(console)
console.warn = function(...args) {
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].indexOf('Electron Security Warning')) {
      return
    }
  }
  return ogWarn.call(this, ...args)
}

// mobx really is helpful...
if (!Object.prototype.toJS) {
  Object.defineProperty(Object.prototype, 'toJS', {
    enumerable: false,
    value: function() {
      return Mobx.toJS(this)
    },
  })
}

// the heavy hitters
window.React = React
window.Constants = Constants
window.Mobx = Mobx
window.MobxUtils = MobxUtils
window.Constants = Constants
window.log = Black.log
window.Black = Black
window.r2 = r2
window.Helpers = Helpers
