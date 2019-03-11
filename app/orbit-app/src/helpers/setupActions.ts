import { Logger } from '@o/logger'
import { action } from 'mobx'

const log = new Logger('setupActions')

type Actions = {
  [key: string]: Function
}

export function setupActions<T extends Actions>(actions: T): T {
  if (!actions) {
    return null
  }
  const finalActions: any = {}
  for (const actionName in actions) {
    const finalAction = (...args) => {
      log.trace.info(`ACTION: ${actionName}`, args)
      return actions[actionName](...args)
    }
    finalActions[actionName] = action(actionName, finalAction)
  }
  return finalActions as T
}
