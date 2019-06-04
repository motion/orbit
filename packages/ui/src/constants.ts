export const isNode =
  typeof process !== 'undefined' && process['release'] && process['release'].name === 'node'
export const isBrowser = !isNode

export const isWebkit =
  typeof document !== 'undefined' && 'webkitLineBreak' in document.documentElement.style

export const defaultSortPressDelay = 200
