import { spy } from 'mobx'
import log from './log'

const defaultOptions = {
  action: true,
  reaction: true,
  transaction: true,
  compute: true,
  predicate: (_event?: Object) => true,
}

export const enableLogging = (options = defaultOptions) => {
  const predicate = options.predicate || defaultOptions.predicate
  return spy(ev => {
    if (predicate(ev) === true) {
      log(ev, options)
    }
  })
}
