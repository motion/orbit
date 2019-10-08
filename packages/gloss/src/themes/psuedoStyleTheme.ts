import { CSSPropertySetStrict, ThemeObject } from '@o/css'

import { ThemeFn } from '../gloss'
import { mergeStyles } from '../helpers/mergeStyles'
import { styleVal } from './propStyleTheme'

// resolves props into styles for valid css
// backs up to theme colors if not found

// TODO make this better (configurable + granular)...
export type PseudoStyleProps = {
  disablePseudoStyles?: boolean
  hoverStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null | ThemeFn<any>
  activeStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null | ThemeFn<any>
  focusStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null | ThemeFn<any>
  disabledStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null | ThemeFn<any>
  focusWithinStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null | ThemeFn<any>
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

const applyPsuedoTheme: ThemeFn = (props: any, previous?: any) => {
  // assigns base theme styles
  // warning! mutative function
  const res = getPsuedoStyles(props, themeKeys)
  const overrides = res.overrides
  let styles: ThemeObjectWithPseudo | null = res.styles

  for (const key in pseudos) {
    const { postfix, pseudoKey, forceOnProp, extraStyleProp } = pseudos[key]
    if (props[forceOnProp] === false) continue // forced off
    const extraStyle = props[extraStyleProp]
    if (extraStyle === null || extraStyle === false) continue // forced empty

    // cache sub-keys like backgroundHover colorHover
    let subKeys = SubThemeKeys[postfix]
    if (!subKeys) {
      subKeys = themeKeys.map(([k]) => [`${k}${postfix}`, k] as [string, string])
      SubThemeKeys[postfix] = subKeys
    }

    // now process and get styles, but dont assign them yet
    let psuedoStyle = getPsuedoStyles(props, subKeys).styles

    // for any prop overrides from base, override them on psuedo too
    if (props.overridePsuedoStyles) {
      if (psuedoStyle && overrides) {
        Object.assign(psuedoStyle, overrides)
      }
    }

    // merge any user-defined psuedo style
    if (typeof extraStyle === 'object' || typeof extraStyle === 'function') {
      let styles = typeof extraStyle === 'function' ? extraStyle(props, previous) : extraStyle
      psuedoStyle = psuedoStyle || {}
      Object.assign(psuedoStyle, styles)
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

function getPsuedoStyles(props: Object, keyMap: KeyMap) {
  let styles: any = null
  let overrides: Object | null = null
  for (const [name, mapName] of keyMap) {
    if (isDefined(props[name])) {
      const val = styleVal(props[name], props)
      styles = styles || {}
      styles[mapName] = val
      overrides = overrides || {}
      overrides[mapName] = val
    }
  }
  return { styles, overrides }
}

export const psuedoStyleTheme: ThemeFn = applyPsuedoTheme
export const psuedoStylePropsTheme: ThemeFn = applyPsuedoTheme
