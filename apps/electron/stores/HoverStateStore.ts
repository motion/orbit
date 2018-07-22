import { App, Desktop, Electron } from '@mcro/stores'
import { store, react } from '@mcro/black/store'

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
  const { x, y } = mousePosition
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

  handleMousePosition = async (mousePos: Point) => {
    // this.updateMouseMoveAt()
    const { hidden, position, docked } = App.orbitState
    const { target, pinned } = App.peekState
    const peekHovered =
      (target || pinned) && isMouseOver(App.peekState, mousePos)
    if (docked) {
      if (mousePos.x > App.state.screenSize[0] - App.dockedWidth) {
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
    if (!hidden) {
      // contextual orbit sidebar
      const orbitHovered = position && isMouseOver(App.orbitState, mousePos)
      Electron.setHoverState({ orbitHovered, peekHovered })
      return
    }
    // nothing showing
    if (Desktop.hoverState.orbitHovered || Desktop.hoverState.peekHovered) {
      Electron.setHoverState({
        orbitHovered: false,
        peekHovered: false,
      })
    }
  }

}