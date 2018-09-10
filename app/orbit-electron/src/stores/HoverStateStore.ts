import { App, Electron } from '@mcro/stores'
import { store, react, ensure } from '@mcro/black'
import { MAC_TOPBAR_HEIGHT } from '@mcro/constants'

type Point = {
  x: number
  y: number
}

type BoundLike = {
  position: number[]
  size: number[]
  [key: string]: any
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

// @ts-ignore
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
    },
  )

  updateHoverStateOnResize = react(
    () => App.orbitState.size,
    () => {
      ensure('has last mouse pos', !!this.lastMousePos)
      this.handleMousePosition(this.lastMousePos)
    },
  )

  handleMousePosition = async (mousePos: Point) => {
    this.lastMousePos = mousePos
    const orbitHovered = isMouseOver(App.orbitState, mousePos)
    let peekHovered = Electron.hoverState
    for (const app of App.appsState) {
      peekHovered[app.id] = isMouseOver(app, mousePos)
    }
    console.log('setting hovered', orbitHovered, peekHovered)
    Electron.setHoverState({ peekHovered, orbitHovered })
    return
  }
}
