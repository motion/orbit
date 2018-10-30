import { App, AppConfig } from '@mcro/stores'
import { PeekTarget } from './types'
import { AppActions } from '../../AppActions'
import { setPeekApp } from './setPeekApp'
import { Logger } from '@mcro/logger'

const log = new Logger('togglePeekApp')
const id = x => `${x.type}${x.id}${x.subType}${x.title}`
const isEqual = (a, b) => a && b && id(a) === id(b)

export function togglePeekApp(appConfig: AppConfig, target?: PeekTarget) {
  log.info('togglePeekApp', appConfig)
  if (isEqual(App.peekState.appConfig, appConfig)) {
    AppActions.clearPeek()
  } else {
    setPeekApp(appConfig, target)
  }
}
