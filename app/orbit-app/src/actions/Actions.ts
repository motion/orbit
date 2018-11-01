export type TrayActions = {
  TrayToggleMemory: number
  TrayTogglePin: number
  TrayToggleOrbit: number
  TrayHoverMemory: number
  TrayHoverPin: number
  TrayHoverOrbit: number
  TrayHoverOut: number
}

type ActionEvents = TrayActions

const ALL_KEY = `${Math.random()}`

class ActionsStore {
  handlers = new Set()
  handlersToType = new WeakMap()

  dispatch<E extends keyof ActionEvents>(type: E, value: ActionEvents[E]) {
    for (const handler of [...this.handlers]) {
      if (this.handlersToType.get(handler) === type) {
        handler(value)
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
