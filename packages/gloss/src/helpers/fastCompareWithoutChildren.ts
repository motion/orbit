var isArray = Array.isArray
var keyList = Object.keys
var hasProp = Object.prototype.hasOwnProperty

function equal(a, b, checkingShallow = false) {
  if (a === b) {
    return true
  }

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    // allow custom equality
    const ukey = a._equalityKey
    if (ukey && ukey === b._equalityKey) {
      return true
    }

    const isArrA = isArray(a)
    const isArrB = isArray(b)
    let i, length, key

    if (isArrA && isArrB) {
      length = a.length
      if (length != b.length) return false
      for (i = length; i-- !== 0; ) {
        if (!equal(a[i], b[i])) {
          return false
        }
      }
      return true
    }
    if (isArrA != isArrB) {
      return false
    }

    const dateA = a instanceof Date
    const dateB = b instanceof Date
    if (dateA != dateB) {
      return false
    }
    if (dateA && dateB) {
      return a.getTime() == b.getTime()
    }

    const regexpA = a instanceof RegExp
    const regexpB = b instanceof RegExp
    if (regexpA != regexpB) {
      return false
    }
    if (regexpA && regexpB) {
      return a.toString() == b.toString()
    }

    const keys = keyList(a)
    length = keys.length

    if (length !== keyList(b).length) {
      return false
    }

    for (i = length; i-- !== 0; ) {
      if (!hasProp.call(b, keys[i])) {
        return false
      }
    }
    // end fast-deep-equal

    // Custom handling for React
    for (i = length; i-- !== 0; ) {
      key = keys[i]
      // dont check children key
      if (checkingShallow && key === 'children') {
        continue
      }
      if (key === '_owner' && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of a react element
        continue
      } else {
        // all other properties should be traversed as usual
        if (!equal(a[key], b[key])) {
          return false
        }
      }
    }

    // fast-deep-equal index.js 2.0.1
    return true
  }

  return a !== a && b !== b
}

export function fastCompareWithoutChildren(a, b) {
  if (process.env.NODE_ENV === 'development') {
    try {
      return equal(a, b, true)
    } catch (error) {
      if (
        (error.message && error.message.match(/stack|recursion/i)) ||
        error.number === -2146828260
      ) {
        // warn on circular references, don't crash
        // browsers give this different errors name and messages:
        // chrome/safari: "RangeError", "Maximum call stack size exceeded"
        // firefox: "InternalError", too much recursion"
        // edge: "Error", "Out of stack space"
        console.warn(
          'Warning: react-fast-compare does not handle circular references.',
          error.name,
          error.message,
        )
        return false
      }
      // some other error. we should definitely know about these
      throw error
    }
  } else {
    return equal(a, b, true)
  }
}
