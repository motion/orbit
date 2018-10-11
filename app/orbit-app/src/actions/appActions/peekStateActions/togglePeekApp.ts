import { Bit, PersonBit } from '@mcro/models'
import { App, AppConfig } from '@mcro/stores'
import { PeekTarget } from './types'
import { Actions } from '../../Actions'
import { getAppConfig, setPeekApp } from './setPeekApp'
import { Logger } from '@mcro/logger'

const log = new Logger('togglePeekApp')

const id = x => `${x.type}${x.id}${x.subType}${x.title}`
const isEqual = (a, b) => a && b && id(a) === id(b)

export function togglePeekApp(item: PersonBit | Bit | AppConfig, target?: PeekTarget) {
  log.info('togglePeekApp', item)
  if (isEqual(App.peekState.appConfig, getAppConfig(item))) {
    Actions.clearPeek()
  } else {
    setPeekApp(item, target)
  }
}
