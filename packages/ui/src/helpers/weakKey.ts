import memoize from 'memoize-weak'

const keyGen = memoize(() => Math.random())

export function weakKey(...args: any[]): number {
  return keyGen(...args)
}
