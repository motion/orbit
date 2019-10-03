import { Config } from './config'
import { BORDER_KEY, COLOR_KEYS, COMMA_JOINED, FALSE_VALUES, SHORTHANDS, TRANSFORM_KEYS_MAP, unitlessNumberProperties } from './constants'
import { CAMEL_TO_SNAKE } from './cssNameMap'
import { boxShadowItem, boxShadowSyntax } from './cssPropertySet'
import { px, stringHash } from './helpers'

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

const objectToCSS = {
  textShadow: ({ x, y, blur, color }) =>
    `${px(x || 0)} ${px(y || 0)} ${px(blur || 0)} ${Config.toColor(color)}`,
  boxShadow: (v: boxShadowSyntax) =>
    `${v.inset ? 'inset ' : ''}${px(v.x || 0)} ${px(v.y || 0)} ${px(v.blur || 0)} ${px(
      v.spread || 0,
    )} ${Config.isColor(v.color) ? Config.toColor(v.color) : v.color || ''}`,
  background: v =>
    Config.isColor(v)
      ? Config.toColor(v)
      : `${Config.toColor(v.color)} ${v.image || ''} ${(v.position
          ? v.position.join(' ')
          : v.position) || ''} ${v.repeat || ''}`,
}

function processArrayItem(key: string, val: any, level: number = 0) {
  // recurse
  if (Array.isArray(val)) {
    return processArray(key, val, level + 1)
  }
  return cssValue(key, val)
}

export function processArray(key: string, value: any[], level: number = 0): string {
  if (key === 'background') {
    if (Config.isColor(value)) {
      return Config.toColor(value)
    }
  }
  // solid default option for borders
  if (BORDER_KEY[key] && value.length === 2) {
    value.push('solid')
  }
  if (key === 'boxShadow') {
    value = value.map(x => processBoxShadow(key, x))
  } else {
    value = value.map(val => processArrayItem(key, val))
  }
  return value.join(level === 0 && COMMA_JOINED[key] ? ', ' : ' ')
}

function processBoxShadow(key: string, val: boxShadowItem) {
  if (Array.isArray(val)) {
    return val.map(x => processArrayItem(key, x)).join(' ')
  }
  if (val && typeof val === 'object') {
    return objectToCSS.boxShadow(val)
  }
  return val
}

function objectValue(key: string, value: any) {
  if (objectToCSS[key]) {
    return objectToCSS[key](value)
  }
  if (
    key === 'scale' ||
    key === 'scaleX' ||
    key === 'scaleY' ||
    key === 'grayscale' ||
    key === 'brightness'
  ) {
    return value
  }
  if (typeof value === 'number') {
    return `${value}px`
  }
  return value
}

const arrayOrObject = (arr, obj) => val => (Array.isArray(val) ? arr(val) : obj(val))

const gradients = {
  linearGradient: (key, object) =>
    `linear-gradient(${arrayOrObject(
      all => processArray(key, all),
      ({ deg, from, to }) => `${deg || 0}deg, ${from || 'transparent'}, ${to || 'transparent'}`,
    )(object)})`,
  radialGradient: processArray,
}

export function processObject(key: string, object: any): string | undefined {
  if (
    key === 'background' ||
    key === 'color' ||
    key === 'borderColor' ||
    key === 'backgroundColor'
  ) {
    if (object.linearGradient) {
      return gradients.linearGradient(key, object.linearGradient)
    }
    if (object.radialGradient) {
      return gradients.radialGradient(key, object.radialGradient)
    }
    if (Config.isColor(object)) {
      return Config.toColor(object)
    }
  }
  // plain object only
  if (!object.constructor || Object.prototype.toString.call(object) === '[object Object]') {
    const toReturn: string[] = []
    for (const subKey in object) {
      if (!object.hasOwnProperty(subKey)) {
        continue
      }
      let value = object[subKey]
      if (Array.isArray(value)) {
        value = processArray(key, value)
      } else {
        value = objectValue(subKey, value)
      }
      toReturn.push(`${TRANSFORM_KEYS_MAP[subKey] || subKey}(${value})`)
    }
    return toReturn.join(' ')
  }
}
