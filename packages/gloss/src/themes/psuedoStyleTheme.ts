import { CSSPropertySetStrict, ThemeObject } from '@o/css'

import { ThemeFn } from '../gloss'
import { mergeStyles } from '../helpers/mergeStyles'
import { styleVal } from './propStyleTheme'

// resolves props into styles for valid css
// backs up to theme colors if not found

// TODO make this better (configurable + granular)...
export type PseudoStyleProps = {
  disablePseudoStyles?: boolean
  hoverStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null
  activeStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null
  focusStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null
  disabledStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null
}

export const psuedoStyleTheme: ThemeFn = (a, b, c) => {
  return applyPsuedoTheme(a, b, c, true)
}

export const psuedoStylePropsTheme: ThemeFn = (a, b, c) => {
  return applyPsuedoTheme(a, b, c, false)
}

const isDefined = (x: any) => typeof x !== 'undefined'

type ThemeObjectWithPseudo = Partial<ThemeObject> & {
  '&:hover'?: ThemeObject
  '&:focus'?: ThemeObject
  '&:active'?: ThemeObject
}

const pseudos = {
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
}

// [fromKey, toKey][]
type KeyMap = [string, string][]

// these are sort of the "base" theme keys
// we can check them and set them for all the psuedo states as well
const themeKeys: KeyMap = [
  ['color', 'color'],
  ['background', 'background'],
  ['borderColor', 'borderColor'],
  ['borderColorBottom', 'borderBottomColor'],
  ['borderColorTop', 'borderTopColor'],
  ['borderColorLeft', 'borderLeftColor'],
  ['borderColorRight', 'borderRightColor'],
]

const SubThemeKeys: { [key: string]: KeyMap } = {}

const applyPsuedoTheme = (props: any, theme: ThemeObject, previous: any, useTheme = false) => {
  if (!theme) {
    throw new Error('No theme passed to psuedoStyleTheme')
  }
  // assigns base theme styles
  // warning! mutative function
  const res = getPsuedoStyles(props, theme, themeKeys, useTheme)
  const overrides = res.overrides
  let styles: ThemeObjectWithPseudo | null = res.styles

  for (const key in pseudos) {
    const { postfix, pseudoKey, forceOnProp, extraStyleProp } = pseudos[key]
    if (props[forceOnProp] === false) continue // forced off
    if (props[extraStyleProp] === null || props[extraStyleProp] === false) continue // forced empty

    // cache sub-keys like backgroundHover colorHover
    let subKeys = SubThemeKeys[postfix]
    if (!subKeys) {
      subKeys = themeKeys.map(([k]) => [`${k}${postfix}`, k] as [string, string])
      SubThemeKeys[postfix] = subKeys
    }

    // now process and get styles, but dont assign them yet
    let psuedoStyle = getPsuedoStyles(props, theme, subKeys, useTheme).styles

    // for any prop overrides from base, override them on psuedo too
    // (this could be an optional parameter)
    if (psuedoStyle && overrides) {
      Object.assign(psuedoStyle, overrides)
    }

    // merge any user-defined psuedo style
    if (typeof props[extraStyleProp] === 'object') {
      psuedoStyle = psuedoStyle || {}
      Object.assign(psuedoStyle, props[extraStyleProp])
    }

    // we conditionally apply it here...
    if (psuedoStyle && !props.disablePseudoStyles) {
      styles = styles || {}
      styles[pseudoKey] = psuedoStyle
    }

    // ... but either way, we allow users to "force" it on
    // (this could also be an optional parameter)
    const booleanOn = forceOnProp && props[forceOnProp] === true

    if (psuedoStyle && booleanOn) {
      styles = styles || {}
      Object.assign(styles, psuedoStyle)
    }
  }

  return mergeStyles(previous, styles)
}

function getPsuedoStyles(props: Object, theme: ThemeObject, keyMap: KeyMap, useTheme = false) {
  let styles: any = null
  let overrides: Object | null = null
  for (const [name, mapName] of keyMap) {
    if (isDefined(props[name])) {
      const val = styleVal(props[name], theme, props)
      styles = styles || {}
      styles[mapName] = val
      overrides = overrides || {}
      overrides[mapName] = val
    } else if (useTheme && isDefined(theme[name])) {
      styles = styles || {}
      styles[mapName] = theme[name]
    }
  }
  return { styles, overrides }
}
