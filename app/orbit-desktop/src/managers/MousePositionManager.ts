import { MAC_TOPBAR_HEIGHT } from '@o/constants'
import { Screen } from '@o/screen'
import { App, Desktop } from '@o/stores'
import { decorate, react } from '@o/use-store'
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

@decorate
export class MousePositionManager {
  lastMousePos?: Point
  onMouseMove = null

  constructor({ onMouseMove }: { screen: Screen; onMouseMove?: Function }) {
    // console.log('should handle mouse position', screen)
    // screen.onMousePosition(this.updateHoverState)
    this.onMouseMove = onMouseMove
  }

  updateHoverAttributes = react(
    () => [App.state.showOrbitMain, App.openMenu, App.orbitState.size],
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
    const orbitHovered = App.state.showOrbitMain && isMouseOver(App.orbitState, mousePos)

    // menu hovered
    const menuHovered = App.openMenu && isMouseOver(App.openMenu, mousePos)

    Desktop.setState({ hoverState: { orbitHovered, menuHovered } })
  }, 100)
}
