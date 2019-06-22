/**
 * Useful for debugging why a component is re-rendering
 */
export function memoDebug(a: Object, b: Object) {
  for (const key in b) {
    if (a[key] !== b[key]) {
      console.log('changed!', key, a[key], b[key])
      return false
    }
  }
  return true
}
