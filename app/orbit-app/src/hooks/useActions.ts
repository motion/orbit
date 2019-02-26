import { useContext } from 'react'
import { ActionsContext } from '../actions/Actions'
import { useStoresSimple } from './useStores'

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
          if (key.indexOf('isMobX') === 0) return boundActions[key]
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
