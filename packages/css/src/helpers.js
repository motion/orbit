// @flow
import type { Color, CSSArray, ToCSSAble } from './types'

function objectToColor(color: Color, converter?: Function): string {
  // final processing of objects and arrays
  if (Array.isArray(color)) {
    const length = color.length
    if (length === 4) {
      return `rgba(${color.join(', ')})`
    }
    if (length === 3) {
      return `rgb(${color.join(', ')})`
    }
  } else if (typeof color === 'object') {
    if (color.a) {
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
    }
    return `rgb(${color.r}, ${color.g}, ${color.b})`
  }
  return color
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
    !Array.isArray(val) &&
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
  return res
}

export function colorToString(color: Color, options): string {
  let res = color

  if (typeof color === 'string') {
    return color
  }
  if (options && options.isColor(color)) {
    return options.processColor(color)
  }
  if (isCSSAble(color)) {
    res = getCSSVal(color)
  }
  return objectToColor(res)
}
