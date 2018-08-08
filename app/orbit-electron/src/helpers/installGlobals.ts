import root from 'global'
import { App, Desktop, Swift, Electron } from '@mcro/stores'
import { getConfig } from '../config'

root['require'] = require
root['Config'] = getConfig()
root['App'] = App
root['Desktop'] = Desktop
root['Electron'] = Electron
root['Swift'] = Swift
