import { App } from '@mcro/stores'

export function clearPeek() {
  if (App.peekState.devModeStick) {
    console.log('Peek pinned, ignore')
    return
  }
  App.setPeekState({
    target: null,
    peekId: null,
    appConfig: null,
    pinned: false,
  })
}
