// @flow
// helper that logs functions, works as decorator or plain

// Takes any string and converts it into a #RRGGBB color.
class StringToColor {
  stringToColorHash = {}
  nextVeryDifferntColorIdx = 0
  veryDifferentColors = [
    '#FF0000',
    '#FFA6FE',
    '#FFDB66',
    '#95003A',
    '#FF00F6',
    '#FFEEE8',
    '#774D00',
    '#90FB92',
    '#D5FF00',
    '#FF937E',
    '#6A826C',
    '#FF029D',
    '#FE8900',
    '#7A4782',
    '#7E2DD2',
    '#85A900',
    '#FF0056',
    '#A42400',
    '#683D3B',
    '#BDC6FF',
    '#263400',
    '#BDD393',
    '#9E008E',
    '#C28C9F',
    '#FF74A3',
    '#E56FFE',
    '#788231',
    '#0E4CA1',
    '#91D0CB',
    '#BE9970',
    '#968AE8',
    '#BB8800',
    '#43002C',
    '#DEFF74',
    '#FFE502',
    '#620E00',
    '#008F9C',
    '#98FF52',
    '#7544B1',
    '#B500FF',
    '#FF6E41',
    '#6B6882',
    '#5FAD4E',
    '#A75740',
    '#A5FFD2',
    '#FFB167',
    '#E85EBE',
  ]
  getColor(str) {
    if (!this.stringToColorHash[str]) {
      this.stringToColorHash[str] = this.veryDifferentColors[
        this.nextVeryDifferntColorIdx++
      ]
    }
    return this.stringToColorHash[str]
  }
}

const Color = new StringToColor()

function cutoff(thing: string) {
  if (thing.length > 150) {
    return thing.slice(0, 150) + '...'
  }
  return thing
}

function prettyPrint(thing: any) {
  if (Array.isArray(thing)) {
    return thing.map(prettyPrint)
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
      `background: ${Color.getColor(things[0].toString())}`
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
log.filter = false && /^(CommanderStore|Document)/
