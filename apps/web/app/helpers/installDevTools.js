import React from 'react'
import ReactDOM from 'react-dom'
import App from '~/app'
import * as RxDB from 'motion-rxdb'
import Mobx from 'mobx'
import MobxUtils from 'mobx-utils'
import Rx from 'rxjs'
import Router from '~/router'
import PouchDB from 'pouchdb-core'
import * as Constants from '~/constants'
import mobxFormatters from 'mobx-formatters'
import _ from 'lodash'
import Immutable from 'immutable'

// Mobx.useStrict(true)

// install console formatters
mobxFormatters(Mobx)
// the heavy hitters
window.React = React
window.App = App
window.Constants = Constants
window.Router = Router
window.Mobx = Mobx
window.MobxUtils = MobxUtils
window.RxDB = RxDB
window.Rx = Rx
window.Immutable = Immutable
window.PouchDB = PouchDB
window.Constants = Constants
window._ = _
