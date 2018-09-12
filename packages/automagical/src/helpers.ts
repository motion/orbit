import * as Mobx from 'mobx'
import { Logger } from '@mcro/logger'
import { MagicalObject, ReactionOptions } from './types'

const PREFIX = '=>'

export const Root = typeof window !== 'undefined' ? window : require('global')

export const logState = new Logger('react')
export const log = new Logger('react')

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

const defaultOpts: ReactionOptions = {
  equals: Mobx.comparer.structural,
}

export function getReactionOptions(userOptions?: ReactionOptions) {
  if (userOptions instanceof Object) {
    return { ...defaultOpts, ...userOptions }
  }
  return defaultOpts
}
