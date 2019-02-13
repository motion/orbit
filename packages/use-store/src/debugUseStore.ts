type UseStoreDebugEvent =
  | {
      type: 'observe'
      key: string
      oldValue: any
      newValue: any
      store: any
      component: any
      componentId: number
    }
  | {
      type: 'render'
      store: any
      component: any
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
      component: any
      componentId: number
      store: any
    }
  | {
      type: 'unmount'
      componentId: number
    }

let debugFns = new Set()
export function debugUseStore(cb: (event: UseStoreDebugEvent) => any) {
  debugFns.add(cb)
  return () => debugFns.delete(cb)
}

export function debugEmit(event: UseStoreDebugEvent) {
  if (debugFns.size) {
    ;[...debugFns].map(fn => fn(event))
  }
}
