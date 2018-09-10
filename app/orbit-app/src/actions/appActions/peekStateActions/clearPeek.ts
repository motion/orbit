import { App } from '@mcro/stores'

export function clearPeek() {
  App.setPeekState({
    target: null,
    peekId: null,
    appConfig: null,
  })
}
