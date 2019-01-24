import * as React from 'react'
import { useContext } from 'react'
import { memoIsEqualDeep } from '../helpers/memoIsEqualDeep'

// heavily memoized to avoid updates...

export const MergeContext = memoIsEqualDeep(function MergeContext<A>(props: {
  Context: React.Context<A>
  value: Partial<A>
  children: React.ReactNode
}): any {
  const { Context } = props
  const context = useContext(props.Context)
  return (
    <Context.Provider value={{ ...context, ...props.value }}>{props.children}</Context.Provider>
  )
})
