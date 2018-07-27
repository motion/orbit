import { App } from '@mcro/stores'

export function toggleDevModeStick() {
  App.setPeekState({
    devModeStick: !App.peekState.devModeStick,
  })
}
