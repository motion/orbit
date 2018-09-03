import { App } from '@mcro/stores'
import { setPeekState } from './setPeekApp'

export function clearPeek() {
  if (App.peekState.devModeStick) {
    console.log('Peek pinned, ignore')
    return
  }
  setPeekState({
    target: null,
    peekId: null,
    appConfig: null,
    pinned: false,
  })
}
