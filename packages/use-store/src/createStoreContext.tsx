import React, { createContext, useContext } from 'react'

import { unwrapProxy, useStore, UseStoreOptions } from './useStore'

// Just unwraps the store so it doesn't keep tracking observables on accident
// makes it easier to create/pass through context

type InferProps<A> = A extends { props: infer B } ? B : {}

export function createStoreContext<Instance>(constructor: { new (): Instance }) {
  const Context = createContext<Instance | null>(null)
  return {
    Context,
    SimpleProvider: ({ value, children }: { value: Instance; children: any }) => {
      return <Context.Provider value={unwrapProxy(value)}>{children}</Context.Provider>
    },
    Provider: ({ children, ...props }: InferProps<Instance> & { children: any }) => {
      const store = useStore(constructor, props as any, { react: false })
      return <Context.Provider value={unwrapProxy(store)}>{children}</Context.Provider>
    },
    useCreateStore(props?: InferProps<Instance>) {
      return useStore(constructor, props as any)
    },
    useStore(props?: InferProps<Instance>, options?: UseStoreOptions): Instance | null {
      const value = useContext(Context)
      const store = useStore(value, props as any, options)
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
