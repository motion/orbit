import { createContext, useContext } from 'react'
import { useStoresSimple } from '../hooks/useStores'
import { previousTab } from './previousTab'
import { setupNewApp } from './setupNewApp'
import { tearApp } from './tearApp'

export const defaultActions = {
  tearApp,
  setupNewApp,
  previousTab,
}

export const ActionsContext = createContext(defaultActions)

type ActionsBound<A> = {
  [key in keyof A]: A[key] extends (...args: any[]) => any ? ReturnType<A[key]> : never
}

export function useActions() {
  const actions = useContext(ActionsContext)
  const stores = useStoresSimple()
  const boundActions = (actions as unknown) as ActionsBound<typeof actions>
  return new Proxy(boundActions, {
    get(_, key) {
      if (typeof key === 'string') {
        if (!actions[key]) {
          throw new Error(`No action ${key.toString()}`)
        }
        return (...args: any[]) => {
          console.log(`Actions.${key}`, args)
          return actions[key](stores)(...args)
        }
      }
    },
  })
}
