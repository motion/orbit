// @flow
// helper that logs functions, works as decorator or plain

const colors = [
  'green',
  'purple',
  'red',
  'brown',
  'orange',
  'darkblue',
  'darkred',
]

function prettyPrint(thing: any) {
  if (Array.isArray(thing)) {
    return thing.map(prettyPrint)
  }
  if (typeof thing === 'object') {
    if (!thing) {
      return 'null'
    }
    try {
      return JSON.stringify(thing, 0, 2)
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
    console.log(`%c${things.map(prettyPrint).join(' ')}`, 'background: orange')
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
  const color = colors[Math.floor(Math.random() * colors.length - 1)]
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
      `%c${parent
        ? `${parent.name || parent.constructor.name}.`
        : ''}${wrapFn.name || name}(${args.join(
        ','
      )}) => ${result}\nSTATE:\n${state}`,
      `color: ${color}`
    )
    return result
  }
}

log.debug = true
log.filter = false && /^(CommanderStore|Document)/
