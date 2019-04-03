const isArray = Array.isArray
const keyList = Object.keys
const hasProp = Object.prototype.hasOwnProperty
const hasElementType = typeof Element !== 'undefined'

export const EQUALITY_KEY = Symbol('EQUALITY_KEY')

export function isEqual(a, b) {
  if (process.env.NODE_ENV !== 'development') {
    return isEqualInner(a, b)
  }
  try {
    return isEqualInner(a, b)
  } catch (err) {
    if ((err.message && err.message.match(/stack|recursion/i)) || err.number === -2146828260) {
      // warn on circular references, don't crash
      // browsers give this different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      console.warn(
        'Warning: @o/fast-compare does not handle circular references.',
        err.name,
        err.message,
      )
      return false
    }
    throw err
  }
}

function isEqualInner(a, b) {
  // fast-deep-equal index.js 2.0.1
  if (a === b) return true

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a[EQUALITY_KEY] && a[EQUALITY_KEY] === b[EQUALITY_KEY]) return true

    let arrA = isArray(a),
      arrB = isArray(b),
      i: number,
      length: number,
      key: string

    if (arrA && arrB) {
      length = a.length
      if (length != b.length) return false
      if (length > 500 || b.length > 500) {
        console.warn('comparing large props! ignoring this')
        return false
      }
      for (i = length; i-- !== 0; ) {
        if (!isEqualInner(a[i], b[i])) return false
      }
      return true
    }

    if (arrA != arrB) return false

    var dateA = a instanceof Date,
      dateB = b instanceof Date
    if (dateA != dateB) return false
    if (dateA && dateB) return a.getTime() == b.getTime()

    var regexpA = a instanceof RegExp,
      regexpB = b instanceof RegExp
    if (regexpA != regexpB) return false
    if (regexpA && regexpB) return a.toString() == b.toString()

    var keys = keyList(a)
    length = keys.length

    if (length !== keyList(b).length) return false

    for (i = length; i-- !== 0; ) if (!hasProp.call(b, keys[i])) return false
    // end fast-deep-equal

    // start @o/fast-compare
    // custom handling for DOM elements
    if (hasElementType && a instanceof Element && b instanceof Element) return a === b

    // custom handling for React
    for (i = length; i-- !== 0; ) {
      key = keys[i]
      if (key === '_owner' && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of a react element
        continue
      } else {
        // all other properties should be traversed as usual
        if (!isEqualInner(a[key], b[key])) return false
      }
    }
    return true
  }

  return a !== a && b !== b
}
