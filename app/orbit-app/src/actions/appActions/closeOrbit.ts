import { App } from '@mcro/stores'

export const closeOrbit = () => {
  App.setOrbitState({ docked: false })
}
