import { isPlainObj } from '../helpers/helpers'
import { GlossProps } from '../types'
import { CompiledTheme, createTheme } from './createTheme'
import { getThemeCoat } from './getThemeCoat'
import { selectThemeSubset } from './selectThemeSubset'
import { unwrapTheme, UnwrapThemeSymbol } from './useTheme'

// Default pre process theme is:
//   1. if coat="" prop, drill down to that theme
//   2. if subTheme="" prop, select that subset of the theme

const themeAltCache = new WeakMap<CompiledTheme, { [key: string]: CompiledTheme }>()

export const preProcessTheme = (props: GlossProps, theme: CompiledTheme) => {
  const parent = unwrapTheme(theme)
  if (props.coat || props.subTheme) {
    const altKey = getAltKey(props)
    const existing = getThemeFromCache(parent, altKey)
    if (existing) {
      return existing
    }
    const subSetTheme = selectThemeSubset(props.subTheme, parent)
    const coatTheme = getThemeCoat(props.coat, subSetTheme ? { ...parent, ...subSetTheme } : parent)
    let next: CompiledTheme | null =
      subSetTheme || coatTheme ? { ...subSetTheme, ...coatTheme } : null

    if (next && next !== parent) {
      // now lets process the postfixes into objects
      next = processPostFixStates(next)
      let nextTheme = createTheme(next, false)

      if (props.subTheme && next._isSubTheme) {
        // proxy back to parent but don't merge,
        // because we want sub-themes to be lighter (ie in CSS variable generation)
        // and generally to only enumerate their unique keys
        const ogSubTheme = nextTheme
        nextTheme = new Proxy(ogSubTheme, {
          get(target, key) {
            if (key === UnwrapThemeSymbol) {
              return ogSubTheme
            }
            if (Reflect.has(target, key)) {
              return Reflect.get(target, key)
            }
            return Reflect.get(parent, key)
          },
        })
      }
      setThemeInCache(parent, altKey, nextTheme)
      return nextTheme
    }
  }
  return theme
}

function getAltKey(props: GlossProps) {
  return `coat${props.coat || ''}-sub${props.subTheme || ''}`
}

function getThemeFromCache(parent: CompiledTheme, altKey: string) {
  const altCache = themeAltCache.get(parent)
  if (altCache && altCache[altKey]) {
    return altCache[altKey]
  }
}

function setThemeInCache(parent: CompiledTheme, key: string, theme: CompiledTheme) {
  if (!themeAltCache.has(parent)) {
    themeAltCache.set(parent, {})
  }
  const altCache = themeAltCache.get(parent)!
  altCache[key] = theme
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
function processPostFixStates(theme: CompiledTheme) {
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

export const pseudos = {
  hover: {
    pseudoKey: '&:hover',
    postfix: 'Hover',
    forceOnProp: 'hover',
    prop: 'hoverStyle',
  },
  focus: {
    pseudoKey: '&:focus',
    postfix: 'Focus',
    forceOnProp: 'focus',
    prop: 'focusStyle',
  },
  focusWithin: {
    pseudoKey: '&:focus-within',
    postfix: 'FocusWithin',
    forceOnProp: 'focusWithin',
    prop: 'focusWithinStyle',
  },
  active: {
    pseudoKey: '&:active',
    postfix: 'Active',
    forceOnProp: 'active',
    prop: 'activeStyle',
  },
  disabled: {
    pseudoKey: '&:disabled',
    postfix: 'Disabled',
    forceOnProp: 'disabled',
    prop: 'disabledStyle',
  },
  selected: {
    pseudoKey: undefined,
    postfix: 'Selected',
    forceOnProp: 'selected',
    prop: 'selectedStyle',
  },
} as const

// activeStyle: '&:active'
export const pseudoProps = Object.keys(pseudos).reduce((acc, key) => {
  acc[pseudos[key].prop] = pseudos[key].pseudoKey
  return acc
}, {})
