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
    let next: CompiledTheme = { ...subSetTheme, ...coatTheme }

    // now lets process the postfixes into objects
    next = processPostFixStates(next)

    if (next && next !== parent) {
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
  return `coat${props.coat || '_'}-sub${props.subTheme || '_'}`
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
    for (const pseudoKey in pseudos) {
      const { postfix, extraStyleProp } = pseudos[pseudoKey]
      const indexOfPostfix = key.indexOf(postfix)
      if (indexOfPostfix === key.length - 1) {
        finalTheme[extraStyleProp] = finalTheme[extraStyleProp] || {}
        finalTheme[extraStyleProp][key.slice(0, indexOfPostfix)] = theme[key]
        continue
      }
    }
    finalTheme[key] = theme[key]
  }
  return finalTheme
}

export const pseudos = {
  hover: {
    pseudoKey: '&:hover',
    postfix: 'Hover',
    forceOnProp: 'hover',
    extraStyleProp: 'hoverStyle',
  },
  focus: {
    pseudoKey: '&:focus',
    postfix: 'Focus',
    forceOnProp: 'focus',
    extraStyleProp: 'focusStyle',
  },
  focusWithin: {
    pseudoKey: '&:focus-within',
    postfix: 'FocusWithin',
    forceOnProp: 'focusWithin',
    extraStyleProp: 'focusWithinStyle',
  },
  active: {
    pseudoKey: '&:active',
    postfix: 'Active',
    forceOnProp: 'active',
    extraStyleProp: 'activeStyle',
  },
  disabled: {
    pseudoKey: '&:disabled',
    postfix: 'Disabled',
    forceOnProp: 'disabled',
    extraStyleProp: 'disabledStyle',
  },
  selected: {
    pseudoKey: undefined,
    postfix: 'Selected',
    forceOnProp: 'selected',
    extraStyleProp: 'selectedStyle',
  },
} as const
