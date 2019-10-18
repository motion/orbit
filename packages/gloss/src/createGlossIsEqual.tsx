import { isEqual } from '@o/fast-compare'
import { isValidElement } from 'react'

/**
 * Gloss componentShouldUpdate optimization - Gloss styles should never
 * rely on react elements (TODO document that, but weve never used it internally even on accident),
 * which means we can do nice optimization by tracking if only non-elements changed.
 */
export function createGlossIsEqual() {
  const shouldUpdateMap = new WeakMap<object, boolean>()
  return {
    shouldUpdateMap,
    isEqual(a: any, b: any) {
      let shouldUpdate = false
      let shouldUpdateInner = false
      for (const key in b) {
        const bVal = b[key]
        if (isValidElement(bVal)) {
          shouldUpdate = true
          continue
        }
        if (!isEqual(a[key], bVal)) {
          shouldUpdate = true
          shouldUpdateInner = true
          break
        }
      }
      // ensure we didnt remove/add keys
      if (!shouldUpdate || !shouldUpdateInner) {
        for (const key in a) {
          if (!(key in b)) {
            shouldUpdate = true
            shouldUpdateInner = true
            break
          }
        }
      }
      shouldUpdateMap.set(b, shouldUpdateInner)
      return !shouldUpdate
    },
  }
}
