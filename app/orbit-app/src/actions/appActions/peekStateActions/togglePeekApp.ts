import { AppConfig } from '@o/kit'
import { Logger } from '@o/logger'
import { App } from '@o/stores'
import { AppActions } from '../AppActions'
import { setPeekApp } from './setPeekApp'

const log = new Logger('togglePeekApp')
const id = x => `${x.type}${x.id}${x.subType}${x.title}`
const isEqual = (a, b) => a && b && id(a) === id(b)

export function togglePeekApp({
  appConfig,
  target,
}: {
  appConfig: AppConfig
  target?: HTMLDivElement
}) {
  log.info('togglePeekApp', appConfig)
  if (isEqual(App.peekState.appConfig, appConfig)) {
    AppActions.clearPeek()
  } else {
    setPeekApp({ appConfig, target })
  }
}
