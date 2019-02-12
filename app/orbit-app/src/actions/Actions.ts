import { createContext, useContext } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { tearApp } from './tearApp'

export const defaultActions = {
  tearApp,
}

export const ActionsContext = createContext(defaultActions)

type ActionsBound<A> = {
  [key in keyof A]: A[key] extends (...args: any[]) => any ? ReturnType<A[key]> : never
}

export function useActions() {
  const actions = useContext(ActionsContext)
  const stores = useStoresSafe()
  const boundActions = (actions as unknown) as ActionsBound<typeof actions>
  return new Proxy(boundActions, {
    get(_, key) {
      if (!actions[key]) {
        throw new Error(`No action ${key.toString()}`)
      }
      return actions[key](stores)
    },
  })
}
