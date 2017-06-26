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

export default function log(...args) {
  const [target, key, descriptor] = args

  const logger = (...things) =>
    console.log(
      `%c${things
        .map(arg =>
          `${typeof arg === 'object' ? JSON.stringify(arg) : arg}`.slice(0, 150)
        )
        .join(' ')}`,
      'background: orange'
    )

  if (
    args.length === 3 &&
    typeof target === 'object' &&
    typeof key === 'string' &&
    typeof descriptor === 'object'
  ) {
    // decorator
    const ogInit = descriptor.initializer
    descriptor.initializer = function() {
      const self = this
      return wrapLogger(ogInit.call(this), target, key)
    }
    return descriptor
  } else if (typeof args[0] === 'function') {
    // regular fn
    const [wrapFn] = args
    logger(wrapFn)
    return wrapLogger(wrapFn)
  }

  logger(...args)
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
