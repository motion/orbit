import * as React from 'react'
import { useContext } from 'react'
import { memoIsEqualDeep } from '../helpers/memoIsEqualDeep'

// heavily memoized to avoid updates...

export const MergeContext = memoIsEqualDeep(
  ({
    Context,
    value,
    children,
  }: {
    Context: React.Context<any>
    value: Object
    children: React.ReactNode
  }): any => {
    const context = useContext(Context)

    return <Context.Provider value={{ ...context, ...value }}>{children}</Context.Provider>
  },
)
