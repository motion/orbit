import { mergeDefined } from '@o/utils'
import React, { createContext, useContext } from 'react'
import { Omit } from '../types'

export function createContextualProps<A extends any>() {
  const Context = createContext(null as A)
  return {
    PassProps({ children, ...rest }: Omit<A, 'children'> & { children?: any }) {
      return <Context.Provider value={rest as A}>{children}</Context.Provider>
    },
    useProps(componentProps: any) {
      const extra = useContext(Context)
      return extra ? mergeDefined(extra, componentProps) : componentProps
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
