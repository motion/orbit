import React, { createContext, useContext } from 'react'

import { unwrapProxy } from './unwrapProxy'
import { useStore, UseStoreOptions } from './useStore'

// Just unwraps the store so it doesn't keep tracking observables on accident
// makes it easier to create/pass through context

type InferProps<A> = A extends { props: infer B } ? B : {}

export function createStoreContext<Instance>(constructor: { new (): Instance }) {
  const Context = createContext<Instance | null>(null)
  return {
    Context,
    ProvideStore: ({ value, children }: { value: Instance; children: any }) => {
      return <Context.Provider value={unwrapProxy(value)}>{children}</Context.Provider>
    },
    // @ts-ignore
    Provider: ({ children, ...props }: InferProps<Instance> & { children: any }) => {
      const store = useStore(constructor, props as any, { react: false })
      return <Context.Provider value={unwrapProxy(store)}>{children}</Context.Provider>
    },
    // memo props by default, this seems to be the least confusing design for now
    // props = false allows for conditional creation
    useCreateStore(props?: InferProps<Instance> | false, opts?: UseStoreOptions) {
      return useStore(props === false ? false : constructor, props as any, opts)
    },
    useStore(options?: UseStoreOptions /* , props?: InferProps<Instance> */): Instance | null {
      const value = useContext(Context)
      const store = useStore(value, undefined, options)
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
