import { isEqual } from '@o/fast-compare'
import React, { useContext, useMemo, useRef } from 'react'

// memoized to avoid updates...

export type MergeContextProps<A> = {
  Context: React.Context<A>
  value: Partial<A>
  children: React.ReactNode
}

export function MergeContext<A>({ Context, value, children }: MergeContextProps<A>): any {
  const context = useContext(Context)
  const key = useRef(0)
  const cur = useRef(value)
  if (!isEqual(cur.current, value)) {
    key.current = key.current + 1
    cur.current = value
  }
  const memoValue = useMemo(() => {
    if (context && typeof context === 'object' && context['constructor'].name === 'Object') {
      return { ...context, ...value }
    } else {
      return value
    }
  }, [key.current])
  return <Context.Provider value={memoValue as A}>{children}</Context.Provider>
}
