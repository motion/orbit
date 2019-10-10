import { validCSSAttr } from '@o/css'

import { unwrapTheme } from '../theme/useTheme'

// a helper that merges styles one level deep
// useful for theme function chains

// basically:
//   1. merge top level plain styles one-by-one
//   2. anything else thats a sub-object, merge

// is mutative because we are running these all once through per-render
// each time you'll start with a fresh style object

export function mergeStyles(next?: Object | null, previous?: Object | null) {
  if (!previous) {
    return next
  }
  // we only need return "new" styles
  if (!next) {
    return
  }
  next = unwrapTheme(next)
  for (const key in next) {
    if (next[key] === undefined) continue
    if (validCSSAttr[key]) {
      previous[key] = next[key]
      continue
    }
    if (typeof next[key] === 'object') {
      if (!previous[key]) {
        previous[key] = next[key]
      } else {
        for (const skey in next) {
          previous[skey] = next[skey]
        }
      }
    }
  }
  return previous
}
