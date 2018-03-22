// @flow
import * as EventKit from 'sb-event-kit'
import * as Events from './events'
import ref_ from './ref'
export isEqual from 'fast-deep-equal'

export type { Helpers } from './types'
export const { CompositeDisposable } = EventKit
export const { requestAnimationFrame, setTimeout, setInterval, on } = Events
export const ref = ref_

// import isEqual from 'fast-deep-equal'
import { comparer } from 'mobx'

// export const isMobxEqual = (_a, _b) => {
//   const a = _a && _a.$mobx ? toJS(_a) : _a
//   const b = _b && _b.$mobx ? toJS(_b) : _b
//   console.log('returing isequal', comparer.structural(_a, _b), isEqual(a, b), [
//     'a',
//     a,
//     'b',
//     b,
//   ])
//   return isEqual(a, b)
// }

export function getReactionOptions(userOptions?: Object) {
  let options = {
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
