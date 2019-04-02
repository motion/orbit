import React, { createContext, useContext } from 'react'
import { Omit } from '../types'

export function createContextualProps<A extends any>() {
  const Context = createContext<Partial<A>>(null)
  return {
    PassProps({ children, ...rest }: Omit<A, 'children'> & { children?: any }) {
      return <Context.Provider value={rest as A}>{children}</Context.Provider>
    },
    useProps(componentProps: A): A {
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
