import { App } from '../../../../stores'

export const closeOrbit = () => {
  App.setOrbitState({ docked: false })
}
