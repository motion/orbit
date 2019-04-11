import React, { createContext, useContext } from 'react'
import { GET_STORE } from './mobxProxyWorm'
import { useStore, UseStoreOptions } from './useStore'

// Just unwraps the store so it doesn't keep tracking observables on accident
// makes it easier to create/pass through context

export function createStoreContext<Instance, Props>(instance: { new (): Instance; props?: Props }) {
  const Context = createContext<Instance | null>(null)
  return {
    Context,
    Provider: ({ value, children }: { value: Instance; children: any }) => {
      return <Context.Provider value={value[GET_STORE]}>{children}</Context.Provider>
    },
    useCreateStore(props: Props) {
      return useStore(instance, props as any)
    },
    useStore(props?: Props, options?: UseStoreOptions): Instance {
      const value = useContext(Context)
      const store = useStore(value, props as any, options)
      if (!store) {
        throw new Error(`No store provided, use createStoreContext().Provider to provide.`)
      }
      return store
    },
  }
}
