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
export { ThemeObject, ThemeValueLike, ThemeSet, ThemeCoats } from './ThemeObject'

export type CSSConfig = {
  errorMessage?: string
  snakeCase?: boolean
}

const emptyObject = Object.freeze({})

export function cssString(styles: Object, opts?: CSSConfig): string {
  if (!styles) return ''
  const shouldSnake = !opts || opts.snakeCase !== false
  let style = ''
  for (let key in styles) {
    let value = cssValue(key, styles[key], false, opts)
    // shorthands
    if (value !== undefined) {
      if (SHORTHANDS[key]) {
        for (let k of SHORTHANDS[key]) {
          k = shouldSnake ? CAMEL_TO_SNAKE[k] || k : k
          style += `${k}:${px(value)};`
        }
      } else {
        style += `${(shouldSnake && CAMEL_TO_SNAKE[key]) || key}:${value};`
      }
    }
  }
  return style
}

const keyHashes = {}
export function cssStringWithHash(styles: Object, opts?: CSSConfig): [number, string] {
  if (!styles) return [0, '']
  const shouldSnake = !opts || opts.snakeCase !== false
  let style = ''
  let hash = 0
  for (let key in styles) {
    const rawVal = styles[key]
    let value = cssValue(key, rawVal, false, opts)
    // shorthands
    if (value !== undefined) {
      if (hash === 0) hash = 5381
      // cache keys hashes, keys are always the same
      let keyHash = keyHashes[key]
      if (!keyHash) {
        keyHash = keyHashes[key] = stringHash(key)
      }
      hash = (hash * 33) ^ keyHash
      if (typeof rawVal === 'number') {
        hash = (hash * 33) ^ (Math.abs(rawVal + 250) + (rawVal < 0 ? 100 : 0))
      } else {
        hash = (hash * 33) ^ stringHash(value)
      }
      if (SHORTHANDS[key]) {
        for (let k of SHORTHANDS[key]) {
          k = shouldSnake ? CAMEL_TO_SNAKE[k] || k : k
          style += `${k}:${px(value)};`
        }
      } else {
        style += `${(shouldSnake && CAMEL_TO_SNAKE[key]) || key}:${value};`
      }
    }
  }
  return [hash, style]
}

export function css(styles: Object, opts?: CSSConfig): Object {
  if (!styles) return emptyObject
  const shouldSnake = !opts || opts.snakeCase !== false
  const toReturn = {}
  for (let key in styles) {
    let value = cssValue(key, styles[key], true, opts)
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

export function cssValue(key: string, value: any, recurse = false, options?: CSSConfig) {
  // if (value && typeof value.cssVariable === 'string' && !value.cssVariable) {
  //   debugger
  // }
  // get falsy values
  if (value === false) {
    value === FALSE_VALUES[key]
  }
  // remove nullish
  if (value === undefined || value === null || value === false) {
    return
  }
  const valueType = typeof value
  if (valueType === 'string' || valueType === 'number') {
    if (valueType === 'number' && !unitlessNumberProperties.has(key)) {
      value += 'px'
    }
    return value
  } else if (value.cssVariable) {
    if (value.getCSSColorVariables) {
      return `rgba(var(--${value.cssVariable}-rgb), ${value.alpha})`
    } else {
      return `var(--${value.cssVariable})`
    }
  } else if (COLOR_KEYS.has(key)) {
    console.log('value.toString()', value.toString())
    // if (value.toString() === '#000000') {
    //   debugger
    // }
    return Config.isColor(value) ? Config.toColor(value) : value
  } else if (Array.isArray(value)) {
    if (key === 'fontFamily') {
      return value.map(x => (x.includes(' ') ? `"${x}"` : x)).join(', ')
    } else {
      return processArray(key, value)
    }
  } else if (valueType === 'object') {
    if (value.getCSSValue) {
      return value.getCSSValue()
    }
    const res = processObject(key, value)
    if (res !== undefined) {
      return res
    }
  } else if (key === 'isolate') {
    return value
  } else {
    if (recurse) {
      const firstChar = key[0]
      if (
        // recurse into psuedo or media query
        firstChar === '&' ||
        firstChar === '@' ||
        key === 'from' ||
        key === 'to'
      ) {
        return css(value, options)
      }
    }
  }
  if (__DEV__) {
    console.error(`Invalid style value for ${key}`)
  }
}

export function styleToClassName(style: string): string {
  return `g${stringHash(style)}`
}

// thx darksky: https://git.io/v9kWO
export function stringHash(str: string): number {
  let res = 5381
  let i = 0
  let len = str.length
  while (i < len) {
    res = (res * 33) ^ str.charCodeAt(i++)
  }
  return res >>> 0
}
