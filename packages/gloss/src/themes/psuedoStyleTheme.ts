import { CSSPropertySetStrict, ThemeObject } from '@o/css'
import { GlossThemeFn } from '../gloss'
import { mergeStyles } from '../helpers/mergeStyles'
import { styleVal } from '../helpers/propsToStyles'

// resolves props into styles for valid css
// backs up to theme colors if not found

// TODO make this better (configurable + granular)...
export type PseudoStyleProps = {
  disablePseudoStyles?: boolean
  hoverStyle?: CSSPropertySetStrict | false | null
  activeStyle?: CSSPropertySetStrict | false | null
  focusStyle?: CSSPropertySetStrict | false | null
}

export const psuedoStyleTheme: GlossThemeFn<any> = (a, b, c) => {
  return applyPsuedoTheme(a, b, c, true)
}

export const psuedoStylePropsTheme: GlossThemeFn<any> = (a, b, c) => {
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

const applyPsuedoTheme = (props, theme, previous, useTheme = false) => {
  if (!theme) {
    throw new Error('No theme passed to psuedoStyleTheme')
  }
  let styles: ThemeObjectWithPseudo = {}

  // assigns base theme styles
  // warning! mutative function
  const overrides = assignThemeStyles(styles, props, theme, themeKeys, useTheme)

  for (const key in pseudos) {
    const { postfix, pseudoKey, forceOnProp, extraStyleProp } = pseudos[key]
    if (props[forceOnProp] === false) continue // forced off
    if (props[extraStyleProp] === null) continue // forced empty

    // cache sub-keys like backgroundHover colorHover
    if (!SubThemeKeys[postfix]) {
      SubThemeKeys[postfix] = themeKeys.map(([k]) => [`${k}${postfix}`, k])
    }
    const subThemeKeys = SubThemeKeys[postfix]

    // now process and get styles, but dont assign them yet
    let stateStyle = {}
    assignThemeStyles(stateStyle, props, theme, subThemeKeys, useTheme)

    // for any prop overrides from base, override them on psuedo too
    // (this could be an optional parameter)
    if (overrides) {
      Object.assign(stateStyle, overrides)
    }

    // merge any user-defined psuedo style
    if (typeof props[extraStyleProp] === 'object') {
      Object.assign(stateStyle, props[extraStyleProp])
    }

    // we conditionally apply it here...
    if (!props.disablePseudoStyles) {
      styles[pseudoKey] = stateStyle
    }

    // ... but either way, we allow users to "force" it on
    // (this could also be an optional parameter)
    const booleanOn = forceOnProp && props[forceOnProp] === true
    if (booleanOn) {
      Object.assign(styles, stateStyle)
    }
  }

  return mergeStyles(previous, styles)
}
function assignThemeStyles(
  styles: Object,
  props: Object,
  theme: ThemeObject,
  keyMap: KeyMap,
  useTheme = false,
) {
  let overrides: Object | null = null
  for (const [name, mapName] of keyMap) {
    if (isDefined(props[name])) {
      const val = styleVal(props[name], theme, props)
      styles[mapName] = val
      overrides = overrides || {}
      overrides[mapName] = val
      continue
    }
    if (useTheme && isDefined(theme[name])) {
      styles[mapName] = theme[name]
    }
  }
  return overrides
}
