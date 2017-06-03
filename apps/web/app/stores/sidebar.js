// @flow
import { store } from '~/helpers'
import { SIDEBAR_WIDTH } from '~/constants'
import { throttle } from 'lodash'

@store
export default class SidebarRootStore {
  width = SIDEBAR_WIDTH
  active = true
  dragging = false

  get trueWidth() {
    return this.active ? this.width : 0
  }

  startDrag = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    this.dragging = true
    document.body.className = 'dragging'
  }

  stopDrag = () => {
    this.dragging = false
    document.body.className = ''
  }

  onMove = e => {
    e.preventDefault()
    if (this.dragging) {
      this.width = Math.min(
        window.innerWidth - 400,
        Math.max(200, window.innerWidth - e.pageX)
      )
    }
  }

  toggle = () => {
    this.active = !this.active
  }

  attachDragger = (node: HTMLElement) => {
    this.on(node, 'mousedown', this.startDrag)
    this.on(node, 'startdrag', this.startDrag)
    this.on(node, 'mouseup', this.stopDrag)
    this.on(window, 'mouseup', this.stopDrag)
    this.on(window, 'mousemove', throttle(this.onMove, 16, true))
    this.on(window, 'keydown', this.windowKey)
    this.on(window, 'resize', this.setWindowSize)
  }
}
