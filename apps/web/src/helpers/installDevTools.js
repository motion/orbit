// @flow
// 🐛 note: dont import router or app here
// it causes the entire app to be imported before boot
import * as React from 'react'
import * as Mobx from 'mobx'
import * as MobxUtils from 'mobx-utils'
import ReactDOM from 'react-dom'
import RxDB from 'rxdb'
import Rx from 'rxjs'
import PouchDB from 'pouchdb-core'
import * as Constants from '~/constants'
import mobxFormatters from 'mobx-formatters'
import _ from 'lodash'
import * as Black from '@mcro/black'
import color from 'color'
import debug from 'debug'
import r2 from '@mcro/r2'
import * as Helpers from '~/helpers'

// Mobx.useStrict(true)

// install console formatters
mobxFormatters(Mobx)

// the heavy hitters
window.React = React
window.ReactDOM = ReactDOM
window.Constants = Constants
window.Mobx = Mobx
window.MobxUtils = MobxUtils
window.RxDB = RxDB
window.Rx = Rx
window.PouchDB = PouchDB
window.Constants = Constants
window._ = _
window.log = Black.log
window.$ = color
window.Black = Black
window.debug = debug
window.r2 = r2
window.Helpers = Helpers

let runners = (window.__mlogRunners = window.__mlogRunners || [])

window.mlog = fn => {
  if (fn.constructor) {
    Object.keys(fn).forEach(key => {
      runners.push(
        Mobx.autorun(() => {
          console.log(fn.constructor.name, key, fn[key])
        }),
      )
    })
    return
  }

  runners.push(
    Mobx.autorun(() => {
      console.log(fn())
    }),
  )
}
window.mlog.clear = () => {
  runners.forEach(r => r())
  runners = []
}

// TODO check if this is needed and fix the global thing if so
// PATCH: ignore octocat
const ogWarn = console.warn.bind(console)
console.warn = function(...args) {
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].indexOf('Octokat BUG: ') > -1) {
      return
    }
  }
  return ogWarn.call(this, ...args)
}
