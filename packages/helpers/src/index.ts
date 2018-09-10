import * as EventKit from 'event-kit'
export * from './events'
export * from './ref'
export * from './on'

export { Helpers } from './types'
export const { CompositeDisposable } = EventKit

export const sleep = ms => new Promise(res => setTimeout(res, ms))
export const idFn = _ => _

import { comparer, toJS } from 'mobx'
export const isEqual = comparer.structural
export const stringify = x => JSON.stringify(toJS(x), null, 2)

export * from './watchModel'
export * from './compose'
