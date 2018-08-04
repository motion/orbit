import root from 'global'
import * as Constants from '../constants'
import { App, Desktop, Swift, Electron } from '@mcro/stores'

root['require'] = require
root['Constants'] = Constants
root['App'] = App
root['Desktop'] = Desktop
root['Electron'] = Electron
root['Swift'] = Swift
