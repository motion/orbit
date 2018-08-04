import root from 'global'
import '@mcro/black/mlog.js'
import * as Mobx from 'mobx'
import * as Constants from '../constants'
import r2 from '@mcro/r2'
import { App, Desktop, Swift, Electron } from '@mcro/stores'
import { modelsList } from '@mcro/models'

root['require'] = require
root['Path'] = require('path')
root['_'] = require('lodash')

root['Constants'] = Constants
root['Mobx'] = Mobx
root['r2'] = r2
root['App'] = App
root['Desktop'] = Desktop
root['Electron'] = Electron
root['Swift'] = Swift

modelsList.map(model => {
  root[`${model.name}`] = model
})
