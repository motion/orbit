export type TrayActions = {
  TrayToggle0: number
  TrayToggle1: number
  TrayToggle2: number
  TrayToggle3: number
  TrayHover0: number
  TrayHover1: number
  TrayHover2: number
  TrayHover3: number
  TrayHoverOut: number
}

type ActionEvents = TrayActions

const ALL_KEY = `${Math.random()}`

class ActionsStore {
  handlers = new Set()
  handlersToType = new WeakMap()

  dispatch<E extends keyof ActionEvents>(type: E, value: ActionEvents[E]) {
    for (const handler of [...this.handlers]) {
      const actionType = this.handlersToType.get(handler)
      if (actionType === type) {
        handler(value)
      }
      if (actionType == ALL_KEY) {
        handler(type, value)
      }
    }
  }

  listen<E extends keyof ActionEvents>(type: E, cb: ((value: ActionEvents[E]) => void)) {
    this.handlers.add(cb)
    this.handlersToType.set(cb, type)
    return () => this.unlisten(cb)
  }

  listenAll<A extends keyof ActionEvents>(cb: ((key: A, value: ActionEvents[A]) => void)) {
    this.handlers.add(cb)
    this.handlersToType.set(cb, ALL_KEY)
    return () => this.unlisten(cb)
  }

  unlisten(fn) {
    if (this.handlers.has(fn)) {
      this.handlers.delete(fn)
      this.handlersToType.delete(fn)
    }
  }
}

export const Actions = new ActionsStore()
