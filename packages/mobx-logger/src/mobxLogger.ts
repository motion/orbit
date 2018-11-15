import { spy } from 'mobx'
import log from './log'

type MobxEvent = {
  name: string
  type: 'reaction' | 'transaction' | 'compute' | 'action'
  spyReportStart: boolean
  time?: number
}

const defaultOptions = {
  action: true,
  reaction: true,
  transaction: true,
  compute: true,
  predicate: (_event: MobxEvent) => true,
}

export const enableLogging = (options = defaultOptions) => {
  const predicate = options.predicate || defaultOptions.predicate
  return spy(ev => {
    if (!ev.name) {
      return
    }
    if (predicate(ev) === true) {
      log(ev, options)
    }
  })
}
