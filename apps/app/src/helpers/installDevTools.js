// 🐛 note: dont import router or app here
// it causes the entire app to be imported before boot
import '@mcro/black/mlog.js'
import * as React from 'react'
import * as Mobx from 'mobx'
import * as MobxUtils from 'mobx-utils'
import ReactDOM from 'react-dom'
import * as Constants from '~/constants'
// import mobxFormatters from 'mobx-formatters'
import * as _ from 'lodash'
import * as Black from '@mcro/black'
import r2 from '@mcro/r2'
import * as Helpers from '~/helpers'
import * as McroHelpers from '@mcro/helpers'
import * as MobxReact from 'mobx-react-devtools'

// Mobx.useStrict(true)

// install console formatters
// mobxFormatters(Mobx)

const ogWarn = console.warn.bind(console)
console.warn = function(...args) {
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].indexOf('Octokat BUG: ') > -1) {
      return
    }
    if (args[0].indexOf('Electron Security Warning')) {
      return
    }
  }
  return ogWarn.call(this, ...args)
}

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
window.ReactDOM = ReactDOM
window.Constants = Constants
window.Mobx = Mobx
window.MobxUtils = MobxUtils
window.MobxReact = MobxReact
window.Constants = Constants
window._ = _
window.log = Black.log
window.Black = Black
window.r2 = r2
window.Helpers = Helpers
window.McroHelpers = McroHelpers
