import { validCSSAttr } from '@o/css'

// a helper that merges styles one level deep
// useful for theme function chains

// basically:
//   1. merge top level plain styles one-by-one
//   2. anything else thats a sub-object, merge

// is mutative because we are running these all once through per-render
// each time you'll start with a fresh style object

export function mergeStyles(previous?: Object | null, next?: Object | null) {
  if (!previous) {
    return next
  }
  // we only need return "new" styles
  if (!next) {
    return
  }
  for (const key in next) {
    if (validCSSAttr[key]) {
      previous[key] = next[key]
      continue
    }
    if (typeof next[key] === 'object') {
      if (!previous[key]) {
        previous[key] = next[key]
      } else {
        Object.assign(previous[key], next[key])
      }
    }
  }
  return previous
}
