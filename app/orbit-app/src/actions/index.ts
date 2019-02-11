import { createContext, useContext } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { tearApp } from './tearApp'

export * from './closeApp'
export * from './closeOrbit'
export * from './open'
export * from './peekStateActions'
export * from './setAppState'
export * from './setContextMessage'

export const Actions = {
  tearApp,
}

export const ActionsContext = createContext(Actions)

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
      return (value: any) => actions[key](stores, value)
    },
  })
}
