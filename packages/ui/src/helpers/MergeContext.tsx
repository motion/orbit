import { isEqual } from '@o/fast-compare'
import React, { useContext } from 'react'

// memoized to avoid updates...

export type MergeContextProps<A> = {
  Context: React.Context<A>
  value: Partial<A>
  children: React.ReactNode
}

export function MergeContext<A>(props: MergeContextProps<A>): any {
  const { Context } = props
  const context = useContext(props.Context)

  if (isEqual(context, props.value)) {
    return props.children
  }

  // merge...
  if (context && typeof context === 'object' && context.constructor.name === 'Object') {
    const value = Object.assign({}, context, props.value)
    return <Context.Provider value={value}>{props.children}</Context.Provider>
  }

  return <Context.Provider value={props.value as A}>{props.children}</Context.Provider>
}
