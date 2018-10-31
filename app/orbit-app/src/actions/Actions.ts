export type TrayActions = {
  TrayToggleMemory: number
  TrayPin: number
  TrayToggleOrbit: number
}

type ActionEvents = TrayActions

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

  unlisten(fn) {
    if (this.handlers.has(fn)) {
      this.handlers.delete(fn)
      this.handlersToType.delete(fn)
    }
  }
}

export const Actions = new ActionsStore()
