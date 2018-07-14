import { App } from '@mcro/stores'

export * from './appStorePeekStateActions'

export const closeOrbit = () => {
  App.setOrbitState({ docked: false })
}
