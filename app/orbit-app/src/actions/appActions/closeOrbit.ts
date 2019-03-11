import { App } from '@o/stores'

export const setOrbitDocked = (docked: boolean) => {
  App.setOrbitState({ docked })
}
