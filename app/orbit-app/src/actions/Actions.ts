import { store } from "@mcro/black";

type ActionEvents = {
  TrayToggleMemory: number
  TrayPin: number
  TrayToggleOrbit: number
}

@store
class ActionsStore {
  history = []
  handlers = new Set()
  handlersToType = new WeakMap()

  dispatch<E extends keyof ActionEvents>(type: E, value: ActionEvents[E]) {
    this.history.push({ type, value })
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
    }
  }
}

export const Actions = new ActionsStore()