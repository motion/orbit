import { AppProps } from '@o/kit'
import { Logger } from '@o/logger'
import { App } from '@o/stores'
import { AppActions } from '../AppActions'
import { setPeekApp } from './setPeekApp'

const log = new Logger('togglePeekApp')
const id = x => `${x.type}${x.id}${x.subType}${x.title}`
const isEqual = (a, b) => a && b && id(a) === id(b)

export function togglePeekApp({
  appProps,
  target,
}: {
  appProps: AppProps
  target?: HTMLDivElement
}) {
  log.info('togglePeekApp', appProps)
  if (isEqual(App.peekState.appProps, appProps)) {
    AppActions.clearPeek()
  } else {
    setPeekApp({ appProps, target })
  }
}
