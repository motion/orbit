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
      componentId: number
    }

let debugFns = new Set()
export function debugUseStore(cb: (event: UseStoreDebugEvent) => any) {
  debugFns.add(cb)
  return () => debugFns.delete(cb)
}

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
    ;[...debugFns].map(fn => fn(event))
  }
}
