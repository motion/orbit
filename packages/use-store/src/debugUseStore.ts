import { throttle } from 'lodash'
import { config } from './configure'

type UseStoreDebugEvent =
  | {
      type: 'observe'
      key: string
      oldValue: any
      newValue: any
      store: any
      componentName: string
      componentId: number
    }
  | {
      type: 'render'
      store: any
      componentName: string
      componentId: number
    }
  | {
      type: 'prop'
      key: string
      oldValue: any
      newValue: any
      store: any
    }
  | {
      type: 'reactiveKeys'
      keys: Set<string>
      componentName: string
      componentId: number
      store: any
    }
  | {
      type: 'unmount'
      store: any
    }
  | {
      type: 'mount'
      store: any
    }
  | {
      type: 'state'
      value: Object
    }

let debugFns = new Set()
export function debugUseStore(cb: (event: UseStoreDebugEvent) => any) {
  debugFns.add(cb)
  return () => debugFns.delete(cb)
}

const allStores = new Set()
const sendStateUpdate = throttle(() => {
  ;[...debugFns].forEach(fn => fn({ type: 'state', value: simpleObject(allStores) }))
})

export function debugEmit(
  {
    component,
    ...event
  }: Partial<UseStoreDebugEvent> & { component?: any; componentName?: string },
  options?: { debug?: boolean },
) {
  if (component) {
    event['componentName'] = component.displayName
  }
  if (options && options.debug) {
    console.log(event)
  }
  if (debugFns.size) {
    ;[...debugFns].forEach(fn => fn(event))
  }
  if (config.debugStoreState) {
    if (event.type === 'mount') {
      allStores.add(event.store)
      sendStateUpdate()
    }
    if (event.type === 'unmount') {
      allStores.delete(event.store)
      sendStateUpdate()
    }
  }
}

function simpleObject(storeSet) {
  const res = {}
  for (const fn of [...storeSet]) {
    const key = fn.constructor.name
    if (res[key]) {
      if (Array.isArray(res[key])) {
        res[key].push(fn)
      } else {
        // convert to array if more than one
        res[key] = [res[key], fn]
      }
    } else {
      res[key] = fn
    }
  }
  return res
}
