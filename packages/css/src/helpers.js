// @flow
import type { Color, CSSArray, ToCSSAble } from './types'

export function objectToColor(color: Color, converter?: Function): string {
  let result = color
  const isObject = typeof color === 'object'

  // final processing of objects and arrays
  if (Array.isArray(result)) {
    const length = result.length
    if (length === 4) {
      return `rgba(${result.join(', ')})`
    }
    if (length === 3) {
      return `rgb(${result.join(', ')})`
    }
  } else if (isObject) {
    if (result.a) {
      return `rgba(${result.r}, ${result.g}, ${result.b}, ${result.a})`
    }
    return `rgb(${result.r}, ${result.g}, ${result.b})`
  }

  return result
}

const arr3to4 = arr => [...arr, arr[1]]
const arr2to4 = arr => [...arr, arr[0], arr[1]]
const arr1to4 = arr => [...arr, arr[0], arr[0], arr[1]]

export function expandCSSArray(given: number | Array<number>): CSSArray {
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

export function isCSSAble(val: any): boolean {
  return (
    val !== null &&
    typeof val === 'object' &&
    (typeof val.toCSS === 'function' ||
      typeof val.css === 'function' ||
      typeof val.rgb === 'function' ||
      typeof val.rgba === 'function')
  )
}

// attempts to work with a variety of css libraries
export function getCSSVal(val: ToCSSAble) {
  let res = val
  if (typeof val.css === 'function') {
    res = val.css()
  } else if (typeof val.toCSS === 'function') {
    res = val.toCSS()
  } else if (typeof val.rgba === 'function') {
    res = val.rgba()
  } else if (typeof val.rgb === 'function') {
    res = val.rgb()
    // support npm color
    if (typeof res.array === 'function') {
      return objectToColor(res.array())
    }
  }
  return res.toString()
}

export function colorToString(color: Color): string {
  if (typeof color === 'string') {
    return color
  }
  if (typeof color === 'object' && isCSSAble(color)) {
    return getCSSVal(color)
  }
  return objectToColor(color)
}
