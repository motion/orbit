export const isNode =
  typeof process !== 'undefined' && process.release.name === 'node'
export const isBrowser = !isNode
