import { logger } from '@mcro/logger'
import { action } from 'mobx'

const log = logger('setupActions')

type Actions = {
  [key: string]: Function
}

export function setupActions<T extends Actions>(actions: T): T {
  if (!actions) {
    return null
  }
  const finalActions: Partial<T> = {}
  for (const actionName in actions) {
    const finalAction = (...args) => {
      log(`ACTION: ${actionName}`, args)
      return actions[actionName](...args)
    }
    finalActions[actionName] = action(actionName, finalAction)
  }
  return finalActions as T
}
