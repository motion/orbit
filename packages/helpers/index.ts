import * as EventKit from 'event-kit'
export * from './events'
export * from './ref'

export { Helpers } from './types'
export const { CompositeDisposable } = EventKit

export const sleep = ms => new Promise(res => setTimeout(res, ms))
export const idFn = _ => _

import { comparer } from 'mobx'
export const isEqual = comparer.structural

export * from './modelQueryReaction'
export * from './modelsEqual'
export * from './watchModel'
