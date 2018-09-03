import { Bit, PersonBit } from '@mcro/models'
import { App } from '@mcro/stores'
import { PeekTarget } from './types'
import { isEqual } from '@mcro/black'
import { Actions } from '../../Actions'
import { log, getAppConfig, setPeekApp } from './setPeekApp'

export function togglePeekApp(item: PersonBit | Bit, target?: PeekTarget) {
  log('togglePeekApp', item)
  if (isEqual(App.peekState.appConfig, getAppConfig(item))) {
    Actions.clearPeek()
  } else {
    setPeekApp(item, target)
  }
}
