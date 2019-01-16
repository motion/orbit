import root from 'global'
import * as Mobx from 'mobx'
import * as Models from '@mcro/models'
import { getGlobalConfig } from '@mcro/config'
import { OrbitSyncersRoot } from '../OrbitSyncersRoot'

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
  root['Bridge'] = require('@mcro/model-bridge')
}
