import * as EventKit from 'sb-event-kit'
import * as Events from './events'
import ref_ from './ref'

export { Helpers } from './types'
export const { CompositeDisposable } = EventKit
export const { requestAnimationFrame, setTimeout, setInterval, on } = Events
export const ref = ref_

export const sleep = ms => new Promise(res => setTimeout(res, ms))

import { comparer } from 'mobx'
export const isEqual = comparer.structural

type ReactionOptions = {
  fireImmediately?: boolean
  equals?: Function
}

export function getReactionOptions(userOptions?: ReactionOptions) {
  let options: ReactionOptions = {
    equals: comparer.structural,
  }
  if (userOptions === true) {
    options.fireImmediately = true
  }
  if (userOptions instanceof Object) {
    options = { ...options, ...userOptions }
  }
  return options
}
