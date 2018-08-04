import { App } from '@mcro/stores'

// this should be more specific and less general

export const hideOrbit = async () => {
  // hide peek first
  if (App.peekState.target && !App.peekState.pinned) {
    App.actions.clearPeek()
    await new Promise(res => setTimeout(res, 80)) // sleep 80
    return
  }
  // hide orbit docked second
  if (App.orbitState.docked) {
    App.setOrbitState({ docked: false })
    return
  }
  App.setOrbitState({ hidden: true })
}
