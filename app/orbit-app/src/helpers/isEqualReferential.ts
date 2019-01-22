export function isEqualReferential(a: Object, b: Object) {
  for (const key in a) {
    if (b[key] !== a[key]) {
      return false
    }
  }
  return true
}
