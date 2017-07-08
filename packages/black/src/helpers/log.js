// @flow
// helper that logs functions, works as decorator or plain
// passes through the first argument

// Takes any string and converts it into a #RRGGBB color.
class StringToColor {
  hash = {}
  colorId = 0
  colors = [
    '#b19cd9',
    '#d9b19c',
    '#9cc4d9',
    '#c4d99c',
    '#87d086',
    '#d08687',
    '#8687d0',
    '#cf86d0',
    '#d0cf86',
    '#64cbcb',
    '#cb9864',
    '#cb6498',
    '#cb6464',
    '#ecc481',
    '#81a9ec',
    '#dfec81',
    '#81ecc4',
    '#c481ec',
  ]
  getColor(thing) {
    const str = cutoff(thing.toString(), 7)
    if (!this.hash[str]) {
      this.hash[str] = this.colors[this.colorId++]
    }
    return this.hash[str]
  }
}

const Color = new StringToColor()

function cutoff(thing: string, amt = 150) {
  if (thing.length > amt) {
    return thing.slice(0, amt - 3) + '...'
  }
  return thing
}

function prettyPrint(thing: any) {
  if (Array.isArray(thing)) {
    return `[ \n${thing.map(prettyPrint)}\n ] `
  }
  if (typeof thing === 'object') {
    if (!thing) {
      return 'null'
    }
    try {
      return cutoff(JSON.stringify(thing, 0, 2))
    } catch (e) {
      return thing
    }
  } else if (typeof thing === 'undefined') {
    return 'undefined'
  } else {
    return thing
  }
}

export default function log(...args) {
  const [target, key, descriptor] = args

  const logger = (...things) => {
    console.log(
      `%c${things.map(prettyPrint).join(' ')}`,
      `background: ${Color.getColor(things[0])}`
    )
  }

  if (
    args.length === 3 &&
    typeof target === 'object' &&
    typeof key === 'string' &&
    typeof descriptor === 'object'
  ) {
    // decorator
    const ogInit = descriptor.initializer
    descriptor.initializer = function() {
      return wrapLogger(ogInit.call(this), target, key)
    }
    return descriptor
  } else if (args.length === 1 && typeof args[0] === 'function') {
    // regular fn
    const [wrapFn] = args
    logger(wrapFn)
    return wrapLogger(wrapFn)
  }

  logger(...args)

  // pass through
  if (args.length === 1) {
    return args[0]
  }
}

function wrapLogger(wrapFn: Function, parent, name?: string) {
  const parentName = parent ? parent.name || parent.constructor.name : ''
  const methodName = wrapFn.name || name
  const color = Color.getColor(`${parentName}${methodName}`)

  return function(...args) {
    const result = wrapFn.call(this, ...args)
    const state =
      this &&
      this.state &&
      Object.keys(this.state).reduce(
        (acc, key, i) =>
          ` | ${key.slice(0, 9).padEnd(10)}: ${`${this.state[key]}`
            .slice(0, 9)
            .padEnd(10)}${i % 3 === 0 ? '\n' : ''}${acc}`,
        ''
      )
    console.log(
      `%c${parent ? `${parentName}.` : ''}${methodName}(${args.join(
        ','
      )}) => ${result}\nSTATE:\n${state}`,
      `color: ${color}`
    )
    return result
  }
}

log.debug = true
log.filter = false && /^(ExplorerStore|Document)/
