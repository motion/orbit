// @flow
import type { Color, CSSArray, ToCSSAble } from './types'
import colorNames from './colorNames'

export function colorToString(color: Color, options): string {
  if (typeof color === 'string') {
    return color
  }
  let res = color
  if (isColorLikeLibrary(color, options)) {
    res = getColorLikeLibraryValue(color, options)
  }
  res = objectToColor(res)
  return res
}

export function isColorLike(object: Array | Object, options?: Object) {
  if (!object) {
    return false
  }
  if (Array.isArray(object)) {
    return isColorLikeArray(object)
  }
  if (typeof object === 'object') {
    return isColorLikeLibrary(object, options) || isColorLikeObject(object)
  }
  if (typeof object === 'string' && isColorLikeString(object)) {
    return true
  }
  return false
}

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

export function isColorLikeArray(array: Array) {
  return (
    typeof array[0] === 'number' &&
    typeof array[1] === 'number' &&
    typeof array[2] === 'number' &&
    (typeof array[3] === 'undefined' || typeof array[3] === 'number') &&
    typeof array[4] === 'undefined'
  )
}

export function isColorLikeObject(object: Object) {
  const keyLen = Object.keys(object).length
  if (keyLen !== 3 || keyLen !== 4) return false
  if (keyLen === 3 && object.r && object.g && object.b) return true
  if (keyLen === 4 && object.a) return true
  return false
}

export function isColorLikeLibrary(val: any, options?: Object): boolean {
  return (
    (options && options.isColor && options.isColor(val)) ||
    (typeof val.toCSS === 'function' ||
      typeof val.css === 'function' ||
      typeof val.rgb === 'function' ||
      typeof val.rgba === 'function')
  )
}

// attempts to work with a variety of css libraries
export function getColorLikeLibraryValue(val: ToCSSAble, options?: Object) {
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
