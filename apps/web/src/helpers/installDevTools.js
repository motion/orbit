// @flow
// 🐛 note: dont import router or app here
// it causes the entire app to be imported before boot
import React from 'react'
import ReactDOM from 'react-dom'
import * as RxDB from 'rxdb'
import * as Mobx from 'mobx'
import MobxUtils from 'mobx-utils'
import Rx from 'rxjs'
import PouchDB from 'pouchdb-core'
import * as Constants from '~/constants'
import mobxFormatters from 'mobx-formatters'
import _ from 'lodash'
import Immutable from 'immutable'
import { log } from '@mcro/black'

// Mobx.useStrict(true)

// install console formatters
// mobxFormatters(Mobx)

// the heavy hitters
window.React = React
window.ReactDOM = ReactDOM
window.Constants = Constants
window.Mobx = Mobx
window.MobxUtils = MobxUtils
window.RxDB = RxDB
window.Rx = Rx
window.Immutable = Immutable
window.PouchDB = PouchDB
window.Constants = Constants
window._ = _
window.log = log
