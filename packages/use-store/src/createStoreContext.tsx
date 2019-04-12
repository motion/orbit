import React, { createContext, useContext } from 'react'
import { GET_STORE } from './mobxProxyWorm'
import { useStore, UseStoreOptions } from './useStore'

// Just unwraps the store so it doesn't keep tracking observables on accident
// makes it easier to create/pass through context

type InferProps<A> = A extends { props: infer B } ? B : {}

export function createStoreContext<Instance, Props extends InferProps<Instance>>(constructor: {
  new (): Instance
}) {
  const Context = createContext<Instance | null>(null)
  return {
    Context,
    SimpleProvider: ({ value, children }: { value: Instance; children: any }) => {
      return <Context.Provider value={value[GET_STORE]}>{children}</Context.Provider>
    },
    Provider: ({ children, ...props }: Props & { children: any }) => {
      const store = useStore(constructor, props as any, { react: false })
      return <Context.Provider value={store[GET_STORE]}>{children}</Context.Provider>
    },
    useCreateStore(props?: Props) {
      return useStore(constructor, props as any)
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

// type test
// class Store {
//   props: { test: boolean } = { test: true }
// }
// const ctx = createStoreContext(Store)
// const x = ctx.useStore()
// x.props.test
// const y = <ctx.Provider test={true}>12</ctx.Provider>
