// @flow
import * as EventKit from 'sb-event-kit'
import * as Events from './events'
import ref_ from './ref'

export type { Helpers } from './types'
export const { CompositeDisposable } = EventKit
export const { setTimeout, setInterval, addEvent, on } = Events
export const ref = ref_

export function isClass(Thing: Class) {
  function fnBody(fn) {
    return toString
      .call(fn)
      .replace(/^[^{]*{\s*/, '')
      .replace(/\s*}[^}]*$/, '')
  }
  return (
    typeof fn === 'function' &&
    (/^class\s/.test(toString.call(Thing)) ||
      /^.*classCallCheck\(/.test(fnBody(Thing)))
  )
}
