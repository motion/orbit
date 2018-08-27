import root from 'global'
import * as Mobx from 'mobx'
import { Entities } from '../entities'
import r2 from '@mcro/r2'
import { App, Desktop, Swift, Electron } from '@mcro/stores'
import { getConfig } from '../config'
import { getGlobalConfig } from '@mcro/config'

root['require'] = require
root['Path'] = require('path')
root['_'] = require('lodash')
root['getConfig'] = getConfig
root['getGlobalConfig'] = getGlobalConfig
root['Mobx'] = Mobx
root['r2'] = r2
root['App'] = App
root['Desktop'] = Desktop
root['Electron'] = Electron
root['Swift'] = Swift

for (const model of Entities) {
  root[`${model.name}`] = model
}
