// @flow
import { store } from '@mcro/black'
import { SIDEBAR_WIDTH } from '~/constants'
import { throttle } from 'lodash'

const IS_SIDEBAR_OPEN = 'sidebarOpen'

@store
export default class SidebarRootStore {
  width = SIDEBAR_WIDTH
  active = false
  dragging = false
  changing = false

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

  toggle = () => {
    const next = !this.active
    this.changing = true
    this.active = next
    this.setTimeout(() => {
      this.changing = false
    }, 200)
    localStorage.setItem(IS_SIDEBAR_OPEN, `${this.active}`)
  }

  attachDragger = (node: HTMLElement) => {
    this.on(node, 'mousedown', this.startDrag)
    this.on(node, 'startdrag', this.startDrag)
    this.on(node, 'mouseup', this.stopDrag)
    this.on(window, 'mouseup', this.stopDrag)
    this.on(window, 'mousemove', this.private.onMouseMove)
    this.on(window, 'keydown', this.windowKey)
    this.on(window, 'resize', this.setWindowSize)
  }

  private = {
    onMouseMove: event => this.dragging && this.private.onMove(event),
    onMove: throttle(
      e => {
        e.preventDefault()
        if (this.dragging) {
          this.width = Math.min(
            window.innerWidth - 400,
            Math.max(200, window.innerWidth - e.pageX)
          )
        }
      },
      32,
      true
    ),
  }
}
