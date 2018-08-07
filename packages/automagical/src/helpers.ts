import * as Mobx from 'mobx'
import {logger} from '@motion/logger'
import { MagicalObject, ReactionOptions } from './types'

const PREFIX = `=>`

export const Root = typeof window !== 'undefined' ? window : require('global')

export const logState = logger('react+')
export const log = logger('react')

export const logRes = (res: any) => {
  if (typeof res === 'undefined') {
    return []
  }
  if (res instanceof Promise) {
    return [PREFIX, 'Promise']
  }
  if (Mobx.isArrayLike(res)) {
    return [PREFIX, res.map(x => Mobx.toJS(x))]
  }
  return [PREFIX, Mobx.toJS(res)]
}

export const getReactionName = (obj: MagicalObject) => {
  return obj.constructor.name
}

export function getReactionOptions(userOptions?: ReactionOptions) {
  let options: ReactionOptions = {
    equals: Mobx.comparer.structural,
  }
  if (userOptions.immediate) {
    options.fireImmediately = true
    delete userOptions.immediate
  }
  if (userOptions === true) {
    options.fireImmediately = true
  }
  if (userOptions instanceof Object) {
    options = { ...options, ...userOptions }
  }
  return options
}
