import React, { createContext, useContext } from 'react'
import { Omit } from '../types'

export function createContextualProps<A extends any>(defaults?: A) {
  const Context = createContext<Partial<A>>(null)
  return {
    PassProps({ children, ...rest }: Omit<A, 'children'> & { children?: any }) {
      return <Context.Provider value={{ ...defaults, ...rest }}>{children}</Context.Provider>
    },
    useProps(componentProps?: Partial<A>): Partial<A> {
      const extra = useContext(Context)
      if (!extra) {
        return componentProps
      }
      // merge just undefined componentProps from extra
      const final = { ...componentProps }
      for (const key in extra) {
        if (typeof final[key] === 'undefined') {
          final[key] = extra[key]
        }
      }
      return final
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
