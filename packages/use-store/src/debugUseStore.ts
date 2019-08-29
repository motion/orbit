import { CurrentComponent } from '@o/automagical'
import { throttle } from 'lodash'

import { config } from './configure'

type UseStoreDebugEvent =
  | {
      type: 'observe'
      key: string
      oldValue: any
      newValue: any
      store: any
      component: CurrentComponent
    }
  | {
      type: 'render'
      store: any
      component: CurrentComponent
      reactiveKeys: Set<string>
    }
  | {
      type: 'prop'
      key: string
      oldValue: any
      newValue: any
      store: any
    }
  | {
      type: 'unmount'
      store: any
      component: CurrentComponent
    }
  | {
      type: 'mount'
      store: any
      component: CurrentComponent
    }
  | {
      type: 'state'
      value: Object
    }

let debugFns = new Set<Function>()
export function debugUseStore(cb: (event: UseStoreDebugEvent) => any) {
  debugFns.add(cb)
  return () => debugFns.delete(cb)
}

const allStores = new Set()
const sendStateUpdate = throttle(() => {
  const value = simpleObject(allStores)
  debugFns.forEach(fn => fn({ type: 'state', value }))
}, 100)

export function debugEmit(event: UseStoreDebugEvent, options?: { debug?: boolean }) {
  const component: CurrentComponent = event['component']
  if (component) {
    if (component.__debug) {
      console.log(
        `%c${component['renderName']} ${event['store'] ? event['store'].constructor.name : ''}`,
        'color: green;',
        event,
      )
    }
  }
  if (options && options.debug) {
    console.log(event)
  }
  if (debugFns.size) {
    debugFns.forEach(fn => fn(event))
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
