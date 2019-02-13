import { getGlobalConfig } from '@mcro/config'
import { App, Desktop, Electron } from '@mcro/stores'
import root from 'global'

root['require'] = require
root['Config'] = getGlobalConfig()
root['App'] = App
root['Desktop'] = Desktop
root['Electron'] = Electron
root['electron'] = require('electron')
root['Mobx'] = require('mobx')
