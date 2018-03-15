// @flow
import * as EventKit from 'sb-event-kit'
import * as Events from './events'
import ref_ from './ref'
export isEqual from 'fast-deep-equal'

export type { Helpers } from './types'
export const { CompositeDisposable } = EventKit
export const { requestAnimationFrame, setTimeout, setInterval, on } = Events
export const ref = ref_
