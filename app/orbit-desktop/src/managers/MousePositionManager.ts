import { App, Desktop } from '@mcro/stores'
import { store, react } from '@mcro/black'
import { MAC_TOPBAR_HEIGHT } from '@mcro/constants'
import { throttle } from 'lodash'
import iohook from 'iohook'

type Point = { x: number; y: number }

type BoundLike = {
  position: number[]
  size: number[]
  [key: string]: any
}

const isMouseOver = (bounds: BoundLike, mousePosition: Point) => {
  if (!bounds || !mousePosition) {
    return false
  }
  const x = mousePosition.x
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
export class MousePositionManager {
  lastMousePos?: Point

  constructor() {
    iohook.on('mousemove', throttle(this.updateHoverState, 32))
  }

  updateHoverAttributes = react(
    () => {
      const { menuState } = App.state.trayState
      const trayOpened = Object.keys(menuState)
        .map(k => menuState[k].open)
        .join('')
      return [App.orbitState.docked, trayOpened, App.orbitState.size]
    },
    () => this.updateHoverState(),
  )

  updateHoverState = throttle((mousePos = this.lastMousePos) => {
    // avoid updates if no move
    const { lastMousePos } = this
    if (lastMousePos && lastMousePos.x === mousePos.x && lastMousePos.y === mousePos.y) {
      return
    }

    // update last pos
    this.lastMousePos = mousePos

    // update hover states...

    // orbit hovered
    const orbitHovered = App.orbitState.docked && isMouseOver(App.orbitState, mousePos)

    // app hovered
    let appHovered = { ...Desktop.hoverState.appHovered }
    for (const [index, app] of App.appsState.entries()) {
      const isPeek = index === 0
      const hovered = isMouseOver(app, mousePos)
      appHovered[app.id] = isPeek ? !!app.target && hovered : hovered
    }

    // menu hovered
    const ms = App.state.trayState.menuState
    const menuHovered = Object.keys(ms).reduce((a, b) => a || ms[b].open, false)

    Desktop.setState({ hoverState: { appHovered, orbitHovered, menuHovered } })
  }, 35)
}
