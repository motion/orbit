import { debounce } from 'lodash'

/**
 * Prevent registering window resize listeners that may trigger at slightly different timings.
 */

export class WindowResizeListener {
  listeners = new Set()
  resizeListener = null
  onResize = null

  constructor(props: { debounce?: number }) {
    this.onResize = props.debounce
      ? debounce(this.onResizeCallback.bind(this), props.debounce)
      : this.onResizeCallback
  }

  mount(x: Function) {
    this.listeners.add(x)
    if (this.listeners.size) {
      window.addEventListener('resize', this.onResize)
    }
    return () => this.unmount(x)
  }

  unmount(x: Function) {
    this.listeners.delete(x)
    if (this.listeners.size === 0) {
      window.removeEventListener('resize', this.onResize)
    }
  }

  onResizeCallback(e: any) {
    this.listeners.forEach((x: Function) => {
      x(e)
    })
  }
}
