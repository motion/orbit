import { getGlobalConfig } from '@o/config'
import * as Models from '@o/models'
import root from 'global'
import * as Mobx from 'mobx'
import { OrbitSyncersRoot } from './OrbitSyncersRoot'

export function installGlobals(syncersRoot: OrbitSyncersRoot) {
  root['Root'] = syncersRoot
  root['require'] = require
  root['Path'] = require('path')
  root['_'] = require('lodash')
  root['typeorm'] = require('typeorm')
  root['Config'] = getGlobalConfig()
  root['Mobx'] = Mobx
  root['toJS'] = Mobx.toJS
  root['Models'] = Models
}
