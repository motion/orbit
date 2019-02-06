import React, { memo, useContext } from 'react'
import isEqual from 'react-fast-compare'

// heavily memoized to avoid updates...

export type MergeContextProps<A> = {
  Context: React.Context<A>
  value: Partial<A>
  children: React.ReactNode
}

export const MergeContext = memo(function MergeContext<A extends Object>(
  props: MergeContextProps<A>,
): any {
  const { Context } = props
  const context = useContext(props.Context)
  return (
    <Context.Provider value={{ ...context, ...props.value }}>{props.children}</Context.Provider>
  )
},
isEqual)
