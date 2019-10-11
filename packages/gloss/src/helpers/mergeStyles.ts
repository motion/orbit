import { validCSSAttr } from '@o/css'

import { unwrapProps, unwrapTheme } from '../theme/useTheme'

// a helper that merges styles one level deep
// useful for theme function chains

// basically:
//   1. merge top level plain styles one-by-one
//   2. anything else thats a sub-object, merge

// is mutative because we are running these all once through per-render
// each time you'll start with a fresh style object

export function mergeStyles(next?: Object | null, previous?: Object | null) {
  if (!previous) return next
  // we only need return "new" styles
  if (!next) return
  const theme = unwrapTheme(next) || next
  const props = unwrapProps(next)
  for (const key in theme) {
    const themeVal = theme[key]
    if (!themeVal) continue
    const propVal = props?.[key]
    if (validCSSAttr[key]) {
      previous[key] = propVal ?? themeVal
      continue
    }
    if (typeof themeVal === 'object') {
      if (propVal === null) continue
      if (!previous[key]) {
        previous[key] = propVal ?? themeVal
      } else {
        for (const skey in theme) {
          previous[skey] = props?.[skey] ?? theme[skey]
        }
      }
    }
  }
  return previous
}
