import { CSSPropertySet, validCSSAttr } from '@o/css'

import { isPlainObj } from '../helpers/helpers'
import { CompiledTheme } from '../theme/createTheme'
import { pseudos } from '../theme/pseudos'
import { unwrapProps, unwrapTheme } from '../theme/useTheme'

// a helper that merges styles one level deep
// useful for theme function chains

// basically:
//   1. merge top level plain styles one-by-one
//   2. anything else thats a sub-object, merge

// is mutative because we are running these all once through per-render
// each time you'll start with a fresh style object

const PseudoThemeMap = new WeakMap()

export function pseudoStyleTheme(next?: Object | null, previous?: Object | null) {
  if (!previous) return next
  // we only need return "new" styles
  if (!next) return
  const theme = unwrapTheme(next) || next
  const pseudoStyles = PseudoThemeMap.get(theme) || createPseudoTheme(theme)
  const props = unwrapProps(next)

  for (const key in pseudoStyles) {
    const themeVal = pseudoStyles[key]
    if (!themeVal) continue
    const propVal = props?.[key]
    if (validCSSAttr[key]) {
      previous[key] = previous[key] ?? propVal ?? themeVal
      continue
    }
    if (typeof themeVal === 'object') {
      if (propVal === false || propVal === null) continue
      if (!previous[key]) {
        previous[key] = propVal ?? themeVal
      } else {
        for (const skey in theme) {
          previous[key][skey] = previous[key][skey] ?? props?.[key]?.[skey] ?? themeVal?.[skey]
        }
      }
    }
  }

  return previous
}

function createPseudoTheme(theme: CompiledTheme): CSSPropertySet {
  const pseudoTheme = themeToCSSPropertySet(theme)
  PseudoThemeMap.set(theme, pseudoTheme)
  return pseudoTheme
}

/**
 * Converts flat style themes into object style ones:
 *
 *   backgroundHover: 'red',
 *      =>
 *   hoverStyle: { background: 'red' }
 *
 * We do this in preProcess because it leads to a nicer pattern that matches what you output.
 * While writing themes using postfix is a lot less work.
 */
function themeToCSSPropertySet(theme: CompiledTheme) {
  let finalTheme: CompiledTheme = {}
  for (const key in theme) {
    if (
      key === 'parent' ||
      key === 'coats' ||
      key === 'name' ||
      key[0] === '_' ||
      isPlainObj(theme[key])
    ) {
      finalTheme[key] = theme[key]
      continue
    }
    let found = false
    for (const pseudoKey in pseudos) {
      const { postfix, prop } = pseudos[pseudoKey]
      const indexOfPostfix = key.indexOf(postfix)
      if (indexOfPostfix > -1 && indexOfPostfix === key.length - postfix.length) {
        const postKey = key.slice(0, indexOfPostfix)
        finalTheme[prop] = finalTheme[prop] || {}
        finalTheme[prop][postKey] = theme[key]
        found = true
        break
      }
    }
    if (!found) {
      finalTheme[key] = theme[key]
    }
  }
  return finalTheme
}


