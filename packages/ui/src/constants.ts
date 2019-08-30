export const isNode =
  typeof process !== 'undefined' && process['release'] && process['release'].name === 'node'

export const isNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'

export const isBrowser = !isNode && !isNative

export const isWebkit =
  typeof document !== 'undefined' && 'webkitLineBreak' in document.documentElement.style

export const defaultSortPressDelay = 340

// sort these from highest to lowest
// TODO this be done nicer
export const zIndex = {
  Banner: 1000000000000,
  Popover: 100000000000,
}
