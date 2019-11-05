import { Config } from './config'
import { BORDER_KEY, COLOR_KEYS, COMMA_JOINED, FALSE_VALUES, SHORTHANDS, TRANSFORM_KEYS_MAP, unitlessNumberProperties } from './constants'
import { CAMEL_TO_SNAKE } from './cssNameMap'
import { boxShadowItem, boxShadowSyntax } from './cssPropertySet'
import { px, stringHash } from './helpers'

// exports

export { GlossPropertySet } from './cssPropertySet'
export { configureCSS } from './config'
export { validCSSAttr } from './constants'
export {
  CSSPropertySet,
  CSSPropertySetResolved,
  CSSPropertySetStrict,
  CSSPropertySetLoose,
  CSSPropertyValThemeFn,
} from './cssPropertySet'
export * from './helpers'
export { camelToSnake, snakeToCamel } from './helpers'
export { ThemeObject, ThemeValueLike, ThemeSet, ThemeCoats } from './ThemeObject'

export type CSSConfig = {
  errorMessage?: string
  snakeCase?: boolean
  ignoreCSSVariables?: boolean
  resolveFunctionValue?: ((val: any) => any)
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

/**
 * Because css objects are somewhat predictable, we can hash while looping them
 * which saves us a full extra loop + some work of hashing the keys
 */
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
      // we want to return 0 if object is empty so we can check later by !hash
      if (hash == 0) hash = 5381
      // start key hash: keys are always the keys from css, cacheable
      let keyHash = keyHashes[key]
      if (!keyHash) {
        keyHash = keyHashes[key] = stringHash(key)
      }
      hash = (hash * 33) ^ keyHash
      // end key hash
      if (typeof rawVal === 'number') {
        hash = (hash * 33) ^ ((Math.abs(rawVal) + 250) + (rawVal < 0 ? 100 : 0))
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
  return [Math.abs(hash), style]
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
  // function first so it can go through other transforms
  if (options?.resolveFunctionValue && typeof value === 'function') {
    value = options?.resolveFunctionValue(value)
  }
  // get falsy values
  if (value === false) {
    value === FALSE_VALUES[key]
  }
  // remove nullish
  if (value === undefined || value === null || value === false) {
    return
  }
  if (value && value.cssVariable && (!options || !options.ignoreCSSVariables)) {
    if (value.toCSS) {
      return value.toCSS()
    }
    return `var(--${value.cssVariable})`
  }
  const valueType = typeof value
  if (valueType === 'string' || valueType === 'number') {
    if (valueType === 'number' && !unitlessNumberProperties.has(key)) {
      value += 'px'
    }
    return value
  } else if (COLOR_KEYS.has(key) && Config.isColor(value)) {
    return Config.toColor(value)
  } else if (Array.isArray(value)) {
    return processArray(key, value, 0, options)
  } else if (valueType === 'object') {
    if (value.getCSSValue) {
      return value.getCSSValue()
    }
    // remove any weird looking objects (non-plain)
    if (value.constructor.name !== 'Object') {
      return
    }
    const res = processObject(key, value, options)
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
    console.error(`Invalid style value for ${key}`, value, options)
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

function processArrayItem(key: string, val: any, level: number = 0, options?: CSSConfig) {
  // recurse
  if (Array.isArray(val)) {
    return processArray(key, val, level + 1, options)
  }
  return cssValue(key, val, false, options)
}

export function processArray(key: string, value: any[], level: number = 0, options?: CSSConfig): string {
  // solid default option for borders
  if (BORDER_KEY.has(key) && value.length === 2) {
    value.push('solid')
  }
  if (key === 'fontFamily') {
    return value.map(x => (x.includes(' ') ? `"${x}"` : x)).join(', ')
  }
  if (key === 'boxShadow') {
    value = value.filter(Boolean).map(x => processBoxShadow(x, options))
  } else {
    value = value.map(val => processArrayItem(key, val, level, options))
  }
  return value.join(level === 0 && COMMA_JOINED.has(key) ? ', ' : ' ')
}

function processBoxShadow(val: boxShadowItem, options?: CSSConfig) {
  if (Array.isArray(val)) {
    return val
      .map(x => {
        return cssValue(Config.isColor(x) ? 'color' : '', x, false, options)
      })
      .join(' ')
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

export function processObject(key: string, object: any, options?: CSSConfig): string | undefined {
  if (COLOR_KEYS.has(key)) {
    if (Config.isColor(object)) {
      return Config.toColor(object)
    }
  }
  // plain object only
  if (!object.constructor || Object.prototype.toString.call(object) === '[object Object]') {
    const toReturn: string[] = []
    for (const subKey in object) {
      if (!Object.hasOwnProperty.call(object, subKey)) {
        continue
      }
      let value = object[subKey]
      if (Array.isArray(value)) {
        value = processArray(key, value, 0, options)
      } else {
        value = objectValue(subKey, value)
      }
      toReturn.push(`${TRANSFORM_KEYS_MAP[subKey] || subKey}(${value})`)
    }
    return toReturn.join(' ')
  }
}
