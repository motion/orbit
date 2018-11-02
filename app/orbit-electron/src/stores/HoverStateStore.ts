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
      ensure('hidden', !docked)
      Electron.setHoverState({ orbitHovered: false })
    },
  )

  updateHoverStateOnResize = react(
    () => App.orbitState.size,
    () => {
      ensure('last mouse pos', !!this.lastMousePos)
      this.handleMousePosition(this.lastMousePos)
    },
  )

  handleMousePosition = async (mousePos: Point) => {
    this.lastMousePos = mousePos

    // orbit hovered
    const orbitHovered = App.orbitState.docked && isMouseOver(App.orbitState, mousePos)

    // app hovered
    let peekHovered = Electron.hoverState.peekHovered
    for (const [index, app] of App.appsState.entries()) {
      const isPeek = index === 0
      const hovered = isMouseOver(app, mousePos)
      peekHovered[app.id] = isPeek ? !!app.target && hovered : hovered
    }

    // menu hovered
    const ms = App.state.trayState.menuState
    const menuHovered = Object.keys(ms).reduce((a, b) => a || ms[b].open, false)

    // Electron.hoverState.menuHovered
    // const { menuState } = App.state.trayState
    // for (const key in menuState) {
    //   const menu = menuState[key]
    //   menuHovered[key] =
    //     menu.open &&
    //     isMouseOver(
    //       {
    //         position: [menu.left, 0],
    //         size: [menu.width, menu.height],
    //       },
    //       mousePos,
    //     )
    // }

    Electron.setHoverState({ peekHovered, orbitHovered, menuHovered })
  }
}
