import { Logger } from '@mcro/logger'
import * as Mobx from 'mobx'
import { MagicalObject, ReactionOptions } from './types'

export const Root = typeof window !== 'undefined' ? window : require('global')

export const logState = new Logger('react')
export const log = new Logger('react')

// returns array because we can "spread it to nothing"
export const logRes = (res: any) => {
  if (typeof res === 'undefined') {
    return []
  }
  if (res instanceof Promise) {
    return ['Promise']
  }
  if (Mobx.isArrayLike(res)) {
    return [res.map(x => Mobx.toJS(x))]
  }
  return [Mobx.toJS(res)]
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
    return JSON.stringify(obj)
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
export const diffLog = (a, b): string => {
  if (a === b || Mobx.comparer.structural(a, b)) {
    return null
  }
  if (!b || typeof b !== 'object' || Array.isArray(b)) {
    return niceLogObj(b)
  }
  // object
  const diff = whatsNew(a, b)
  if (Object.keys(diff).length) {
    // log the diff as json if its short enough, easier to see
    return niceLogObj(diff)
  }
  return null
}

export const toJSDeep = obj => {
  try {
    const next = Mobx.toJS(obj)
    if (Array.isArray(next)) {
      return next.map(toJSDeep)
    }
    return next
  } catch (err) {
    console.warn(err)
    return obj
  }
}

const COLOR_WHEEL = [
  '#DB0A5B',
  '#3455DB',
  '#008040',
  '#005555',
  '#007FAA',
  '#0000E0',
  '#9B59B6',
  '#7462E0',
  '#8B008B',
  '#8B008B',
  '#483D8B',
  '#8D6708',
  '#D43900',
  '#802200',
  '#AA2E00',
  '#870C25',
]

let seenNames = new Set()

export const logGroup = ({ name, result, changed, timings = '', reactionArgs }) => {
  const hasChanges = !!changed
  if (hasChanges) {
    const shortName = name.slice(0, 8)
    seenNames.add(shortName)
    const color = COLOR_WHEEL[[...seenNames].indexOf(shortName) % COLOR_WHEEL.length]
    let [storeName, args, methodName] = [].concat(...name.split('(').map(x => x.split('.')))
    if (!methodName) {
      methodName = args
      args = null
    }
    const formattedName = `${storeName}`.padStart(16, ' ')
    console.log(
      `%cᐧ %c${formattedName}${args ? `%c(${args}` : ''}.%c${methodName}`,
      `color: #999`,
      `color: ${color}; font-weight: bold;`,
      ...(args ? [`color: ${color};`] : []),
      `font-weight: bold;`,
      changed.length > 90 ? `${changed.slice(0, 90)}...` : changed,
      ...(timings ? [timings] : []),
    )
    console.debug('  ⮑ %cargs', 'color: orange;', toJSDeep(reactionArgs))
    console.debug('  ⮑ %cresp', 'color: orange;', ...logRes(result))
  } else {
    console.debug(`${name} no change, reaction args:`, toJSDeep(reactionArgs))
  }
}
