import * as Mobx from 'mobx'
import { Logger } from '@mcro/logger'
import { MagicalObject, ReactionOptions } from './types'
import prettyStringify from 'json-stringify-pretty-compact'

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

export const niceLogObj = obj => {
  try {
    return prettyStringify(obj)
  } catch {
    return obj
  }
}

export const obj = a => a && typeof a === 'object'

export const whatsNew = (a, b) => {
  let final = {}
  for (const ak in a) {
    const av = a[ak]
    const bv = b[ak]
    if (Mobx.comparer.structural(av, bv)) {
      continue
    }
    final[ak] = obj(av) && obj(bv) ? whatsNew(av, bv) : b[ak]
  }
  return final
}

// simple diff output for dev mode
export const diffLog = (a, b) => {
  if (a === b || Mobx.comparer.structural(a, b)) {
    return []
  }
  if (!b || typeof b !== 'object' || Array.isArray(b)) {
    return ['\nnew value:\n', niceLogObj(b)]
  }
  // object
  const diff = whatsNew(a, b)
  if (Object.keys(diff).length) {
    // log the diff as json if its short enough, easier to see
    return ['\ndiff:\n', niceLogObj(diff)]
  }
  return []
}

export const toJSDeep = obj => {
  const next = Mobx.toJS(obj)
  if (Array.isArray(next)) {
    return next.map(toJSDeep)
  }
  return next
}
