import { getGlobalConfig } from '@o/config'
import * as Cosal from '@o/cosal'
import { Entities } from '@o/models'
import { App, Desktop, Electron } from '@o/stores'
import root from 'global'
import * as Mobx from 'mobx'

import { OrbitDesktopRoot } from '../OrbitDesktopRoot'

export function installGlobals(AppRoot: OrbitDesktopRoot) {
  root['Root'] = AppRoot
  root['restart'] = AppRoot.restart
  root['require'] = require
  root['Path'] = require('path')
  root['_'] = require('lodash')
  root['typeorm'] = require('typeorm')
  root['Config'] = getGlobalConfig()
  root['Mobx'] = Mobx
  root['App'] = App
  root['Desktop'] = Desktop
  root['Electron'] = Electron
  root['toJS'] = Mobx.toJS
  root['Cosal'] = Cosal
  root['Models'] = require('@o/models')

  for (const model of Entities) {
    root[`${model.name}`] = model
  }
}
