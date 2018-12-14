import { ColorObject, Color, CSSArray } from './types'
import colorNames from './colorNames'
import { CAMEL_TO_SNAKE, SNAKE_TO_CAMEL } from './cssNameMap'
import { BORDER_KEY, COMMA_JOINED, TRANSFORM_KEYS_MAP } from './constants'

export const px = (x: number | string) => (typeof x === 'number' ? `${x}px` : x)

export function hash(thing: string | Object) {
  let str = thing
  if (thing instanceof Object) {
    str = JSON.stringify(thing)
  }
  if (typeof str === 'string') {
    let hash = 5381
    let i = str.length
    while (i) {
      hash = (hash * 33) ^ str.charCodeAt(--i)
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return hash >>> 0
  }
}

export function camelToSnake(key: string) {
  return CAMEL_TO_SNAKE[key] || key
}

export function snakeToCamel(key: string) {
  return SNAKE_TO_CAMEL[key] || key
}

function memoize<Result>(cb: Function): (a?: any, b?: any, c?: any) => Result {
  const Cache = new WeakMap()
  return (key: any, ...rest: Array<any>) => {
    // use first argument as key
    const mappable = key && typeof key === 'object'
    if (mappable) {
      const res = Cache.get(key)
      if (res) {
        return res
      }
    }
    const newVal: Result = cb.call(this, key, ...rest)
    if (mappable) {
      Cache.set(key, newVal)
    }
    return newVal
  }
}

export function colorToString(color: Color, options?: Object): string {
  if (typeof color === 'string') {
    return color
  }
  if (!color) {
    return 'transparent'
  }
  let res = color
  if (isColorLikeLibrary(color, options)) {
    res = getColorLikeLibraryValue(color, options)
  }
  // @ts-ignore
  res = objectToColor(res)
  return `${res}`
}

export const isColorLike = memoize((object: any, options?: Object) => {
  if (!object) {
    return false
  }
  if (typeof object === 'string' && isColorLikeString(object)) {
    return true
  }
  if (Array.isArray(object)) {
    return isColorLikeArray(object)
  }
  if (typeof object === 'object') {
    return isColorLikeLibrary(object, options) || isColorLikeObject(object)
  }
  return false
})

export function isColorLikeString(str: string) {
  if (str[0] === '#' && (str.length === 4 || str.length === 7)) {
    return true
  }
  if (str.indexOf('rgb(') === 0 || str.indexOf('rgba(') === 0) {
    return true
  }
  if (colorNames[str]) {
    return true
  }
  return false
}

export function isColorLikeArray(array: Array<number | string>) {
  return (
    typeof array[0] === 'number' &&
    typeof array[1] === 'number' &&
    typeof array[2] === 'number' &&
    (typeof array[3] === 'undefined' || typeof array[3] === 'number') &&
    typeof array[4] === 'undefined'
  )
}

export function isColorLikeObject(object: ColorObject) {
  const keyLen = Object.keys(object).length
  if (keyLen < 3 || keyLen > 4) return false
  if (keyLen === 3 && object.r && object.g && object.b) return true
  if (keyLen === 4 && object.a) return true
  return false
}

export function isColorLikeLibrary(val: any, options?: any): boolean {
  return (
    (options && options.isColor && typeof val === 'object' && options.isColor(val)) ||
    (typeof val.toCSS === 'function' ||
      typeof val.css === 'function' ||
      typeof val.rgb === 'function' ||
      typeof val.rgba === 'function')
  )
}

// attempts to work with a variety of css libraries
export function getColorLikeLibraryValue(val: any, options?: any) {
  let res = val
  if (options && options.isColor(val)) {
    return options.toColor(val)
  }
  if (typeof val.css === 'function') {
    res = val.css()
  } else if (typeof val.toCSS === 'function') {
    res = val.toCSS()
  } else if (typeof val.rgba === 'function') {
    res = val.rgba()
  } else if (typeof val.rgb === 'function') {
    res = val.rgb()
  }
  return res
}

const objectToColor: ((Color) => string) = memoize(color => {
  // final processing of objects and arrays
  if (Array.isArray(color)) {
    const length = color.length
    if (length === 4) {
      return `rgba(${color.join(', ')})`
    }
    if (length === 3) {
      return `rgb(${color.join(', ')})`
    }
  } else if (color instanceof Object) {
    if (color.a) {
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
    }
    return `rgb(${color.r}, ${color.g}, ${color.b})`
  }
  return color.toString()
})

const arr3to4 = arr => [...arr, arr[1]]
const arr2to4 = arr => [...arr, arr[0], arr[1]]
const arr1to4 = arr => [...arr, arr[0], arr[0], arr[1]]

export function expandCSSArray(given: number | Array<number | string>): CSSArray {
  if (typeof given === 'number') {
    return [given, given, given, given]
  }
  if (Array.isArray(given)) {
    switch (given.length) {
      case 3:
        return arr3to4(given)
      case 2:
        return arr2to4(given)
      case 1:
        return arr1to4(given)
      default:
        return given
    }
  }
  throw new Error('Invalid type given')
}

// style transform creator
const isColor = (color: any) => isColorLike(color, Config.options)
const toColor = (color: Color) => colorToString(color, Config.options)

const objectToCSS = {
  textShadow: ({ x, y, blur, color }) => `${px(x)} ${px(y)} ${px(blur)} ${toColor(color)}`,
  boxShadow: v =>
    v.inset || v.x || v.y || v.blur || v.spread || v.color
      ? `${v.inset ? 'inset' : ''} ${px(v.x)} ${px(v.y)} ${px(v.blur)} ${px(v.spread)} ${toColor(
          v.color,
        )}`
      : toColor(v),
  background: v =>
    isColor(v)
      ? toColor(v)
      : `${toColor(v.color)} ${v.image || ''} ${(v.position ? v.position.join(' ') : v.position) ||
          ''} ${v.repeat || ''}`,
}

function processArrayItem(key: string, val: any, level: number = 0) {
  // recurse
  if (isColor(val)) {
    return toColor(val)
  }
  if (Array.isArray(val)) {
    return processArray(key, val, level + 1)
  }
  return typeof val === 'number' ? `${val}px` : val
}

function processArray(key: string, value: Array<number | string>, level: number = 0): string {
  if (key === 'background') {
    if (isColor(value)) {
      return toColor(value)
    }
  }
  // solid default option for borders
  if (BORDER_KEY[key] && value.length === 2) {
    value.push('solid')
  }
  return value
    .map(val => processArrayItem(key, val))
    .join(level === 0 && COMMA_JOINED[key] ? ', ' : ' ')
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

const GRADIENT = {
  linearGradient: (key, object) =>
    `linear-gradient(${arrayOrObject(
      all => processArray(key, all),
      ({ deg, from, to }) => `${deg || 0}deg, ${from || 'transparent'}, ${to || 'transparent'}`,
    )(object)})`,
  radialGradient: processArray,
}

export function processObject(key: string, object: any): string {
  if (
    key === 'background' ||
    key === 'color' ||
    key === 'borderColor' ||
    key === 'backgroundColor'
  ) {
    if (object.linearGradient) {
      return GRADIENT.linearGradient(key, object.linearGradient)
    }
    if (object.radialGradient) {
      return GRADIENT.radialGradient(key, object.radialGradient)
    }
    if (isColor(object)) {
      return toColor(object)
    }
  }
  // if (key === 'border') {
  //   return ``
  // }
  const toReturn = []
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
