// @flow
import * as EventKit from 'sb-event-kit'
import * as Events from './events'
import ref_ from './ref'
export isEqual from 'fast-deep-equal'

export type { Helpers } from './types'
export const { CompositeDisposable } = EventKit
export const { requestAnimationFrame, setTimeout, setInterval, on } = Events
export const ref = ref_

import isEqual from 'fast-deep-equal'
import { toJS } from 'mobx'

export const isMobxEqual = (_a, _b) => {
  const a = _a && _a.$mobx ? toJS(_a) : _a
  const b = _b && _b.$mobx ? toJS(_b) : _b
  return isEqual(a, b)
}

export function getReactionOptions(userOptions?: Object) {
  let options = {
    equals: isMobxEqual,
  }
  if (userOptions === true) {
    options.fireImmediately = true
  }
  if (userOptions instanceof Object) {
    options = { ...options, ...userOptions }
  }
  return options
}
