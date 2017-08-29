import { measure } from '~/helpers'
import * as Constants from '~/constants'

class WindowStore {
  constructor(opts = {}) {
    this.path = opts.path || Constants.JOT_HOME
    this.key = opts.key || Math.random()
    this.position = opts.position || measure().position
    this.size = opts.size || measure().size
    this.showBar = true
  }
  get active() {
    return this.path !== Constants.JOT_HOME
  }
  setPosition = x => (this.position = x)
  setSize = x => (this.size = x)
  toggleBar() {
    console.log('toggling bar')
    this.showBar = !this.showBar
  }
  hasPathCbs = []
  onHasPath(cb) {
    this.hasPathCbs.push(cb)
  }
  setPath(value) {
    this.path = value
    if (value !== '/') {
      for (const listener of this.hasPathCbs) {
        listener()
      }
      this.hasPathCbs = []
    }
  }
}

export default class WindowsStore {
  windows = []
  addWindow = () => {
    this.windows = [new WindowStore({ size: [450, 700] }), ...this.windows]
  }
  next(path) {
    if (!this.windows[0]) {
      this.addWindow()
      return
    }
    this.addWindow()
    const toShowWindow = this.windows[1]

    console.log('> next path is', toShowWindow.path)
    if (toShowWindow) {
      if (path) {
        toShowWindow.setPath(path)
      }
    }

    console.log('next path:', path, toShowWindow.key)
    return toShowWindow
  }
  findBy(key) {
    return this.windows.find(x => `${x.key}` === `${key}`)
  }
  removeBy(key, val) {
    this.windows = this.windows.filter(win => win[key] !== val)
  }
  removeByPath(path) {
    this.removeBy('path', path)
  }
  removeByKey(key) {
    console.log('removing by key', key, 'old len', this.windows.length)
    this.removeBy('key', key)
    console.log('new len', this.windows.length)
  }
}
