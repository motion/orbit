import { isEqual } from '@o/fast-compare'

export * from './newEmptyAppBit'

export const isEqualDebug = (a, b) => {
  for (const key in a) {
    if (!isEqual(a[key], b[key])) {
      console.log('falsy key', key, a[key], b[key])
      return false
    }
  }
  return true
}
