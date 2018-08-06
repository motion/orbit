import { App, Electron } from '@mcro/stores'
import { store, react } from '@mcro/black'
import { MAC_TOPBAR_HEIGHT } from '@mcro/constants'

type Point = {
  x: number
  y: number
}

type BoundLike = {
  position: [number, number]
  size: [number, number]
}

const isMouseOver = (bounds: BoundLike, mousePosition: Point) => {
  if (!bounds || !mousePosition) {
    return false
  }
  const { x } = mousePosition
  const y = mousePosition.y - MAC_TOPBAR_HEIGHT
  const { position, size } = bounds
  if (!position || !size) {
    return false
  }
  const withinX = x > position[0] && x < position[0] + size[0]
  const withinY = y > position[1] && y < position[1] + size[1]
  return withinX && withinY
}

@store
export class HoverStateStore {
  lastMousePos?: Point

  unsetOrbitHoveredOnHide = react(
    () => App.orbitState.docked,
    docked => {
      if (!docked) {
        Electron.setHoverState({ orbitHovered: false })
        return
      }
      throw react.cancel
    },
  )

  updateHoverStateOnResize = react(
    () => App.orbitState.size,
    () => {
      if (!this.lastMousePos) {
        throw react.cancel
      }
      this.handleMousePosition(this.lastMousePos)
    },
  )

  handleMousePosition = async (mousePos: Point) => {
    this.lastMousePos = mousePos
    const { target, pinned } = App.peekState
    const peekHovered =
      (target || pinned) && isMouseOver(App.peekState, mousePos)
    if (App.orbitState.docked) {
      if (isMouseOver(App.orbitState, mousePos)) {
        Electron.setHoverState({ orbitHovered: true, peekHovered })
      } else {
        Electron.setHoverState({ orbitHovered: false, peekHovered })
      }
      return
    }
    if (pinned) {
      Electron.setHoverState({ peekHovered })
      return
    }
    // if (!hidden) {
    //   // contextual orbit sidebar
    //   const orbitHovered = position && isMouseOver(App.orbitState, mousePos)
    //   Electron.setHoverState({ orbitHovered, peekHovered })
    //   return
    // }
    // nothing showing
    if (Electron.hoverState.orbitHovered || Electron.hoverState.peekHovered) {
      Electron.setHoverState({
        orbitHovered: false,
        peekHovered: false,
      })
    }
  }
}
