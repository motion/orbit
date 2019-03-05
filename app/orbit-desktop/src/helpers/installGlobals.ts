import { getGlobalConfig } from '@mcro/config'
import * as Cosal from '@mcro/cosal'
import { Entities } from '@mcro/models'
import r2 from '@mcro/r2'
import { App, Desktop, Electron } from '@mcro/stores'
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
  root['r2'] = r2
  root['App'] = App
  root['Desktop'] = Desktop
  root['Electron'] = Electron
  root['toJS'] = Mobx.toJS
  root['Cosal'] = Cosal
  root['Models'] = require('@mcro/models')

  for (const model of Entities) {
    root[`${model.name}`] = model
  }
}
