import * as React from 'react'
import { useContext } from 'react'
import { memoIsEqualDeep } from '../helpers/memoIsEqualDeep'

// heavily memoized to avoid updates...

export type MergeContextProps<A> = {
  Context: React.Context<A>
  value: Partial<A>
  children: React.ReactNode
}

export const MergeContext = memoIsEqualDeep(function MergeContext<A>(
  props: MergeContextProps<A>,
): any {
  const { Context } = props
  const context = useContext(props.Context)
  return (
    <Context.Provider value={{ ...context, ...props.value }}>{props.children}</Context.Provider>
  )
})
