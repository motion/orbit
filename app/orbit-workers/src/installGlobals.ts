import { getGlobalConfig } from '@o/config'
import * as Models from '@o/models'
import root from 'global'
import * as Mobx from 'mobx'
import { OrbitWorkersRoot } from './OrbitWorkersRoot'

export function installGlobals(workersRoot: OrbitWorkersRoot) {
  root['Root'] = workersRoot
  root['require'] = require
  root['Path'] = require('path')
  root['_'] = require('lodash')
  root['typeorm'] = require('typeorm')
  root['Config'] = getGlobalConfig()
  root['Mobx'] = Mobx
  root['toJS'] = Mobx.toJS
  root['Models'] = Models
}
