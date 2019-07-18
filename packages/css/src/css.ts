import { Config } from './config'
import { COLOR_KEYS, FALSE_VALUES, SHORTHANDS, unitlessNumberProperties } from './constants'
import { CAMEL_TO_SNAKE } from './cssNameMap'
import { processArray, processObject, px } from './helpers'

// exports

export { GlossPropertySet } from './cssPropertySet'
export { configureCSS } from './config'
export { psuedoKeys, validCSSAttr } from './constants'
export {
  CSSPropertySet,
  CSSPropertySetResolved,
  CSSPropertySetStrict,
  CSSPropertySetLoose,
} from './cssPropertySet'
export * from './helpers'
export { camelToSnake, snakeToCamel } from './helpers'
export { ThemeObject, ThemeSet } from './ThemeObject'

export type CSSConfig = {
  errorMessage?: string
  snakeCase?: boolean
}

const emptyObject = Object.freeze({})

export function cssString(styles: Object, opts?: CSSConfig): string {
  if (!styles) return ''
  const shouldSnake = !opts || opts.snakeCase !== false
  let toReturn = ''
  for (let key in styles) {
    let value = cssValue(key, styles[key], opts)
    // shorthands
    if (value !== undefined) {
      if (SHORTHANDS[key]) {
        for (let k of SHORTHANDS[key]) {
          k = shouldSnake ? CAMEL_TO_SNAKE[k] || k : k
          toReturn += `${k}:${px(value)};`
        }
      } else {
        if (process.env.NODE_ENV === 'development' && typeof value === 'number' && isNaN(value)) {
          debugger
        }
        toReturn += `${(shouldSnake && CAMEL_TO_SNAKE[key]) || key}:${value};`
      }
    }
  }
  return toReturn
}

export function css(styles: Object, opts?: CSSConfig): Object {
  if (!styles) return emptyObject
  const shouldSnake = !opts || opts.snakeCase !== false
  const toReturn = {}
  for (let key in styles) {
    let value = cssValue(key, styles[key], opts)
    // shorthands
    if (value !== undefined) {
      if (SHORTHANDS[key]) {
        for (let k of SHORTHANDS[key]) {
          k = shouldSnake ? CAMEL_TO_SNAKE[k] || k : k
          toReturn[k] = px(value)
        }
      } else {
        toReturn[(shouldSnake && CAMEL_TO_SNAKE[key]) || key] = value
      }
    }
  }
  return toReturn
}

function cssValue(key: string, value: any, options?: CSSConfig) {
  let valueType = typeof value
  // get real values
  if (value === false) {
    value === FALSE_VALUES[key]
    valueType = typeof value
  }
  // remove nullish
  if (value === undefined || value === null || value === false) {
    return
  }
  const firstChar = key[0]
  if (valueType === 'string' || valueType === 'number') {
    if (valueType === 'number' && !unitlessNumberProperties.has(key)) {
      value += 'px'
    }
    return value
  } else if (COLOR_KEYS.has(key)) {
    return Config.isColor(value) ? Config.toColor(value) : value
  } else if (Array.isArray(value)) {
    if (key === 'fontFamily') {
      return value.map(x => (x.indexOf(' ') ? `"${x}"` : x)).join(', ')
    } else {
      return processArray(key, value)
    }
  } else if (
    // recurse into psuedo or media query
    firstChar === '&' ||
    firstChar === '@' ||
    key === 'from' ||
    key === 'to'
  ) {
    return css(value, options)
  } else if (valueType === 'object') {
    if (value.toCSS) {
      return value.toCSS()
    }
    // not react element
    if (process.env.NODE_ENV === 'development') {
      if (value['$$typeof'] === Symbol.for('react.element')) {
        throw new Error('You passed a react element to a style')
      }
    }
    return processObject(key, value)
  } else if (key === 'isolate') {
    return value
  }
  if (process.env.NODE_ENV === 'development') {
    console.debug(`Invalid style value for ${key}`, value)
  }
}

export function styleToClassName(style: string): string {
  return `g${stringHash(style)}`
}

// thx darksky: https://git.io/v9kWO
function stringHash(str: string): number {
  let res = 5381
  let i = 0
  let len = str.length
  while (i < len) {
    res = (res * 33) ^ str.charCodeAt(i++)
  }
  return res >>> 0
}
