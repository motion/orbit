import { names } from './css-color-names'
import { memoizeOne } from './memoizeOne'
import { ColorObject } from './types'

export const isColorLike = memoizeOne<boolean>((object: any) => {
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
    return isColorLikeLibrary(object) || isColorLikeObject(object)
  }
  return false
})

function isColorLikeString(str: string) {
  if (str[0] === '#') {
    return true
  }
  if (str[0] === 'r' && str[1] === 'g' && str[3] === 'b' && (str[4] === 'a' || str[4] === '(')) {
    return true
  }
  if (names[str]) {
    return true
  }
  return false
}

function isColorLikeArray(array: (number | string)[]) {
  return (
    typeof array[0] === 'number' &&
    typeof array[1] === 'number' &&
    typeof array[2] === 'number' &&
    (typeof array[3] === 'undefined' || typeof array[3] === 'number') &&
    typeof array[4] === 'undefined'
  )
}

function isColorLikeObject(object: ColorObject) {
  const keyLen = Object.keys(object).length
  if (keyLen < 3 || keyLen > 4) return false
  if (keyLen === 3 && object.r && object.g && object.b) return true
  if (keyLen === 4 && object.a) return true
  return false
}

export function isColorLikeLibrary(val: any): boolean {
  return val.cssIsColor || typeof val.css === 'function'
}

// attempts to work with a variety of css libraries
export function getColorLikeLibraryValue(val: any) {
  let res = val
  if (val.css && typeof val.css === 'function') {
    res = val.css()
  } else if (val.getCSSValue && typeof val.getCSSValue === 'function') {
    res = val.getCSSValue()
  }
  return res.toString ? res.toString() : res
}
