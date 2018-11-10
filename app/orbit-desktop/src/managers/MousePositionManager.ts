import { App, Desktop } from '@mcro/stores'
import { store, react } from '@mcro/black'
import { MAC_TOPBAR_HEIGHT } from '@mcro/constants'
import { Oracle } from '@mcro/oracle'
import { throttle } from 'lodash'

type Point = [number, number]

type BoundLike = {
  position: number[]
  size: number[]
  [key: string]: any
}

const isMouseOver = (bounds: BoundLike, mousePosition: Point) => {
  if (!bounds || !mousePosition) {
    return false
  }
  const x = mousePosition[0]
  const y = mousePosition[1] - MAC_TOPBAR_HEIGHT
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
  onMouseMove = null

  constructor({ oracle, onMouseMove }: { oracle: Oracle; onMouseMove?: Function }) {
    oracle.onMousePosition(this.updateHoverState)
    this.onMouseMove = onMouseMove
  }

  updateHoverAttributes = react(
    () => [App.orbitState.docked, App.openMenu, App.orbitState.size],
    () => this.updateHoverState(),
  )

  updateHoverState = throttle((mousePos: Point = this.lastMousePos) => {
    if (this.onMouseMove) {
      this.onMouseMove()
    }

    // avoid updates if no move
    const { lastMousePos } = this
    if (lastMousePos && lastMousePos[0] === mousePos[0] && lastMousePos[1] === mousePos[1]) {
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
    const menuHovered = App.openMenu && isMouseOver(App.openMenu, mousePos)

    Desktop.setState({ hoverState: { appHovered, orbitHovered, menuHovered } })
  }, 35)
}
