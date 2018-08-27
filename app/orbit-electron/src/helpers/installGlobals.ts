import root from 'global'
import { App, Desktop, Swift, Electron } from '@mcro/stores'
import { getGlobalConfig } from '@mcro/config'

root['require'] = require
root['Config'] = getGlobalConfig()
root['App'] = App
root['Desktop'] = Desktop
root['Electron'] = Electron
root['Swift'] = Swift
