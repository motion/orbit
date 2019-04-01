import React, { createContext, useContext } from 'react'
import { GET_STORE } from './mobxProxyWorm'
import { useStore, UseStoreOptions } from './useStore'

// Just unwraps the store so it doesn't keep tracking observables on accident
// makes it easier to create/pass through context

export function createStoreContext<Instance, Props>(_: { new (): Instance; props?: Props }) {
  _
  const Context = createContext(null as Instance)
  return {
    Context,
    Provider: ({ value, children }: { value: Instance; children: any }) => {
      return <Context.Provider value={value[GET_STORE]}>{children}</Context.Provider>
    },
    useStore(props?: Props, options?: UseStoreOptions): Instance {
      const value = useContext(Context)
      return useStore(value, props as any, options)
    },
  }
}
