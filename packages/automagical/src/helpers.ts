import { isEqual } from '@o/fast-compare'
import { Logger } from '@o/logger'

import { MagicalObject, ReactionOptions } from './types'

export const Root = typeof window !== 'undefined' ? window : require('global')

export const logState = new Logger('react')
export const log = new Logger('react')

export const getReactionName = (obj: MagicalObject) => {
  return obj.constructor.name
}

const defaultOpts: ReactionOptions = {
  equals: isEqual,
}

export function getReactionOptions(userOptions?: ReactionOptions | null) {
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
