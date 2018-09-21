import root from 'global'
import * as Mobx from 'mobx'
import { Entities } from '@mcro/entities'
import r2 from '@mcro/r2'
import { App, Desktop, Electron } from '@mcro/stores'
import { getGlobalConfig } from '@mcro/config'
import { stringify } from '@mcro/helpers'

root['require'] = require
root['Path'] = require('path')
root['_'] = require('lodash')
root['Config'] = getGlobalConfig()
root['Mobx'] = Mobx
root['r2'] = r2
root['App'] = App
root['Desktop'] = Desktop
root['Electron'] = Electron
root['stringify'] = stringify
root['toJS'] = Mobx.toJS

for (const model of Entities) {
  root[`${model.name}`] = model
}
