import { isEqual } from '@mcro/fast-compare'
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

  // avoids context merge if its the same
  if (isEqual(context, props.value)) {
    return props.children
  }

  if (context && typeof context === 'object') {
    const value = Object.assign({}, context, props.value)
    return <Context.Provider value={value}>{props.children}</Context.Provider>
  }

  return <Context.Provider value={props.value as A}>{props.children}</Context.Provider>
}
