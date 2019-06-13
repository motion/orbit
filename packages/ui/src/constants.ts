export const isNode =
  typeof process !== 'undefined' && process['release'] && process['release'].name === 'node'

export const isNative = navigator.product === 'ReactNative'

export const isBrowser = !isNode && !isNative

export const isWebkit =
  typeof document !== 'undefined' && 'webkitLineBreak' in document.documentElement.style

export const defaultSortPressDelay = 200
