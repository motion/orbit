import { App } from '@mcro/stores'

export const setOrbitDocked = (docked: boolean) => {
  App.setOrbitState({ docked })
}
