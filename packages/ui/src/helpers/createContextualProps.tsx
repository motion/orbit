import React, { createContext, useContext, useMemo } from 'react'

import { Omit } from '../types'

export function createContextualProps<A extends any>(defaults?: A) {
  const Context = createContext<Partial<A> | null>(null)
  const PassProps = ({ children, ...rest }: Partial<Omit<A, 'children'> & { children?: any }>) => {
    const memoVal = useMemo(() => {
      return { ...defaults, ...rest }
    }, [rest])
    // @ts-ignore
    return <Context.Provider value={memoVal}>{children}</Context.Provider>
  }
  return {
    Context,
    PassProps,
    useProps<B extends Partial<A> | undefined>(
      componentProps?: B,
    ): B extends undefined ? A : B & A {
      const extra = useContext(Context)
      return useMemo(() => {
        if (!extra) {
          return componentProps as any
        }
        // merge just undefined componentProps from extra
        const final: any = { ...componentProps }
        for (const key in extra) {
          if (typeof final[key] === 'undefined') {
            final[key] = extra[key]
          }
        }
        return final as any
      }, [extra, componentProps])
    },
    Reset({ children }: { children: any }) {
      const extraProps = useContext(Context)
      if (!extraProps) {
        return children
      }
      return <Context.Provider value={null}>{children}</Context.Provider>
    },
  }
}
