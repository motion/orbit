import root from 'global'
import '@mcro/black/mlog.js'
import * as Mobx from 'mobx'
import { Entities } from '../entities'
import * as Constants from '../constants'
import r2 from '@mcro/r2'
import { App, Desktop, Swift, Electron } from '@mcro/stores'

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

for (const model of Entities) {
  root[`${model.name}`] = model
}
