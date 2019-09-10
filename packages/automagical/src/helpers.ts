import { isEqual } from '@o/fast-compare'
import { Logger } from '@o/logger'

import { MagicalObject, ReactionOptions } from './types'

export const Root = typeof window !== 'undefined' ? window : require('global')

export const logState = new Logger('react')
export const log = new Logger('react')

export const getReactionName = (obj: MagicalObject) => {
  return obj.constructor.name
}

const isEqualWarn = (a, b) => {
  const x = Date.now()
  try {
    return isEqual(a, b)
  } finally {
    const time = Date.now() - x
    if (time > 1) {
      console.warn(
        `Dev mode warning: were doing deep equality comparison, this took ${time}ms to compare. Want to change? Use "equals" option to change`,
        a,
        b,
      )
    }
  }
}

const comparator = process.env.NODE_ENV === 'development' ? isEqualWarn : isEqual

/**
 * Tries to do a deep equality, but will fail when bail to === when it sees "big" things
 */
const isEqualStupidOptimize = (a: any, b: any) => {
  if (!a || !b) return a === b
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a === b) return true
    if (a.length !== b.length) return false
    if (a[0] === b[0]) return a.every((ai, i) => ai === b[i])
    if (a.length < 20) return comparator(a, b)
    return false
  }
  if (typeof b === 'object') {
    if (Object.keys(b).length < 10) {
      return comparator(a, b)
    } else {
      return false
    }
  }
  if (b instanceof Set) {
    if (b.size < 10) return comparator(a, b)
    return false
  }
  return comparator(a, b)
}

const defaultOpts = {
  equals: isEqualStupidOptimize, //process.env.NODE_ENV === 'development' ? isEqualWarn : isEqual,
}

export function getReactionOptions(
  userOptions?: ReactionOptions | null,
): ReactionOptions & { equals: ReactionOptions['equals'] } {
  if (userOptions instanceof Object) {
    return { ...defaultOpts, ...userOptions }
  }
  return defaultOpts
}

export const obj = a => a && typeof a === 'object'

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

let seenNames = new Set<string>()

export const logGroup = ({ name = '', result, changed, timings = '', reactionArgs }) => {
  const hasChanges = !!changed
  if (hasChanges) {
    const shortName = `${name}`.slice(0, 8)
    seenNames.add(shortName)
    const color = COLOR_WHEEL[[...seenNames].indexOf(shortName) % COLOR_WHEEL.length]
    const argsDeep = name.split('(').map(x => x.split('.'))
    const logArgs: string[] = [].concat(...(argsDeep as any))
    let [storeName, args, methodName] = logArgs
    if (!methodName) {
      methodName = args
      args = ''
    }
    // aim to make the "." align
    const padAmt = Math.max(0, 22 - args.length)
    const formattedName = `${storeName}`.padStart(padAmt, ' ')
    console.log(
      `%cᐧ %c${formattedName}${args ? `%c(${args}` : ''}.%c${methodName}`,
      `color: #999`,
      `color: ${color};`,
      ...(args ? [`color: ${color};`] : []),
      `font-weight: bold;`,
      '=>',
      changed[1],
      ...(timings ? [timings] : []),
    )
    if (!window['enableLog']) return
    console.debug('  ⮑ %cprev =>', 'color: orange;', changed[0])
    console.debug('  ⮑ %cin   =>', 'color: orange;', reactionArgs)
    console.debug('  ⮑ %cout  =>', 'color: orange;', result)
  } else {
    console.debug(`${name} no change, reaction args:`, reactionArgs)
  }
}
