//
// a nice helper for logging:
//
//  1. passes through first argument
//  2. colorizes with a stable unqiue color based on arguments
//  3. formats JSON automatically
//  4. can be used as a temporary decorator for a class:
//     4.1. automatically wraps and logs all functions args/returns
//     4.2. logs state before/after function call

let doCutoff = true

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
    const str = cutoff((thing || '').toString(), 7)
    if (!this.hash[str]) {
      this.hash[str] = this.colors[this.colorId++]
    }
    return this.hash[str]
  }
}

const Color = new StringToColor()

function cutoff(thing, amt = 150) {
  if (doCutoff && thing.length > amt) {
    return thing.slice(0, amt - 3) + '...'
  }
  return thing
}

function prettyPrint(thing) {
  if (typeof thing === 'function') {
    return (thing.toString && thing.toString()) || thing
  }
  if (Array.isArray(thing)) {
    return `[ \n${thing.map(prettyPrint)}\n ] `
  }
  if (typeof thing === 'object') {
    if (!thing) {
      return 'null'
    }
    try {
      return cutoff(JSON.stringify(thing, null, 2))
    } catch (e) {
      return thing
    }
  } else if (typeof thing === 'undefined') {
    return 'undefined'
  } else {
    return thing
  }
}

function doLog(...args) {
  const [target, key, descriptor] = args

  const logger = (...things) => {
    console.log(
      `%c${things.map(prettyPrint).join(' ')}`,
      `background: ${Color.getColor(things[0])}`,
    )
  }

  if (
    args.length === 3 &&
    typeof target === 'object' &&
    typeof key === 'string' &&
    typeof descriptor === 'object'
  ) {
    // decorator
    if (descriptor.initializer) {
      const ogInit = descriptor.initializer
      descriptor.initializer = function() {
        return wrapLogger(ogInit.call(this), target, key)
      }
    } else if (descriptor.get) {
      const ogGet = descriptor.get
      descriptor.get = function() {
        return wrapLogger(ogGet, target, key)
      }
    }

    return descriptor
  } else if (args.length === 1 && typeof args[0] === 'function') {
    // regular fn
    const [wrapFn] = args
    logger(wrapFn)
    return wrapLogger(wrapFn, null, null)
  }

  logger(...args)

  // pass through
  if (args.length === 1) {
    return args[0]
  }
}

export function log(...args) {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  doCutoff = true
  doLog(...args)
  doCutoff = false
  return args[0]
}

// @ts-ignore
log.full = function(...args) {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  doCutoff = false
  doLog(...args)
  return args[0]
}

function wrapLogger(wrapFn, parent, name) {
  const parentName =
    parent instanceof Object
      ? parent.name || (parent.constructor && parent.constructor.name) || ''
      : parent || ''
  const methodName = wrapFn.name || name || ''
  const color = Color.getColor(`${parentName}${methodName}`)

  return function(this: any, ...args: any[]) {
    const result = wrapFn.call(this, ...args)
    const state =
      this &&
      this.state &&
      Object.keys(this.state).reduce(
        (acc, key, i) =>
          // @ts-ignore
          ` | ${key.slice(0, 9).padEnd(10)}: ${`${this.state[key]}`.slice(0, 9).padEnd(10)}${
            i % 3 === 0 ? '\n' : ''
          }${acc}`,
        '',
      )
    console.log(
      `%c${parent ? `${parentName}.` : ''}${methodName}(${args
        .map(prettyPrint)
        .join(',')}) => ${result}\nSTATE:\n${state}`,
      `color: ${color}`,
    )
    return result
  }
}

// @ts-ignore
log.debug = true
// @ts-ignore
log.filter = /^(DocPage)/
