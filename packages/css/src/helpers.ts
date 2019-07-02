import { Config } from './config'
import { BORDER_KEY, COMMA_JOINED, TRANSFORM_KEYS_MAP } from './constants'
import { CAMEL_TO_SNAKE, SNAKE_TO_CAMEL } from './cssNameMap'
import { boxShadowSyntax } from './cssPropertySet'

export const px = (x: number | string) =>
  typeof x === 'number' ? `${x}px` : `${+x}` === x ? `${x}px` : x

export function camelToSnake(key: string) {
  return CAMEL_TO_SNAKE[key] || key
}

export function snakeToCamel(key: string) {
  return SNAKE_TO_CAMEL[key] || key
}

const arr3to4 = arr => [...arr, arr[1]]
const arr2to4 = arr => [...arr, arr[0], arr[1]]
const arr1to4 = arr => [...arr, arr[0], arr[0], arr[1]]

export function expandCSSArray(given: number | (number | string)[]): (number | string)[] {
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

const objectToCSS = {
  textShadow: ({ x, y, blur, color }) => `${px(x)} ${px(y)} ${px(blur)} ${Config.toColor(color)}`,
  boxShadow: v =>
    v.inset || v.x || v.y || v.blur || v.spread || v.color
      ? `${v.inset ? 'inset' : ''} ${px(v.x)} ${px(v.y)} ${px(v.blur)} ${px(
          v.spread,
        )} ${Config.toColor(v.color)}`
      : Config.toColor(v),
  background: v =>
    Config.isColor(v)
      ? Config.toColor(v)
      : `${Config.toColor(v.color)} ${v.image || ''} ${(v.position
          ? v.position.join(' ')
          : v.position) || ''} ${v.repeat || ''}`,
}

function processArrayItem(key: string, val: any, level: number = 0) {
  // recurse
  if (Config.isColor(val)) {
    return Config.toColor(val)
  }
  if (Array.isArray(val)) {
    return processArray(key, val, level + 1)
  }
  return typeof val === 'number' ? `${val}px` : val
}

export function processArray(key: string, value: (number | string)[], level: number = 0): string {
  if (key === 'background') {
    if (Config.isColor(value)) {
      return Config.toColor(value)
    }
  }
  if (key === 'boxShadow') {
    return value
      .map(val =>
        val && typeof val === 'object' ? processBoxShadow(val) : processArrayItem(key, val),
      )
      .join(level === 0 && COMMA_JOINED[key] ? ', ' : ' ')
  }
  // solid default option for borders
  if (BORDER_KEY[key] && value.length === 2) {
    value.push('solid')
  }
  return value
    .map(val => processArrayItem(key, val))
    .join(level === 0 && COMMA_JOINED[key] ? ', ' : ' ')
}

function processBoxShadow(val: boxShadowSyntax) {
  return `${val.inset ? 'inset ' : ''}${val.x || 0}px ${val.y || 0}px ${val.blur ||
    0}px ${val.spread || 0}px ${
    Config.isColor(val.color) ? Config.toColor(val.color) : val.color || ''
  }`
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

export function processObject(key: string, object: any): string {
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
