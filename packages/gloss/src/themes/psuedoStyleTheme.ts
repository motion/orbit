import { CSSPropertySetStrict, ThemeObject } from '@o/css'

import { ThemeFn } from '../gloss'
import { mergeStyles } from '../helpers/mergeStyles'
import { pseudos } from '../theme/preProcessTheme'
import { getOriginalProps } from '../theme/useTheme'

// resolves props into styles for valid css
// backs up to theme colors if not found

export const pseudoStyleTheme = applyPseudoTheme(true)
export const pseudoStylePropsTheme = applyPseudoTheme(false)

// TODO make this better (configurable + granular)...
export type PseudoStyleProps = {
  hoverStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null | ThemeFn<any>
  activeStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null | ThemeFn<any>
  focusStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null | ThemeFn<any>
  disabledStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null | ThemeFn<any>
  focusWithinStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null | ThemeFn<any>
  selectedStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null | ThemeFn<any>
  baseOverridesPseudo?: boolean
}

const isDefined = (x: any) => typeof x !== 'undefined'

type ThemeObjectWithPseudo = Partial<ThemeObject> & {
  '&:hover'?: ThemeObject
  '&:focus'?: ThemeObject
  '&:active'?: ThemeObject
}

function applyPseudoTheme(useTheme = false) {
  const themeFn: ThemeFn<PseudoStyleProps> = (theme, previous) => {
    const props = getOriginalProps(theme)
    // assigns base theme styles
    // warning! mutative function
    const res = getPseudoStyles(theme, props, useTheme)
    const overrides = res.overrides
    let styles: ThemeObjectWithPseudo | null = res.styles

    for (const key in pseudos) {
      const { pseudoKey, forceOnProp, extraStyleProp } = pseudos[key]
      if (theme[forceOnProp] === false) continue // forced off
      const extraStyle = theme[extraStyleProp]
      if (extraStyle === null || extraStyle === false) continue // forced empty

      // now process and get styles, but dont assign them yet
      let pseudoStyle = getPseudoStyles(theme, props, useTheme).styles

      // for any prop overrides from base, override them on pseudo too
      if (props.baseOverridesPseudo) {
        if (pseudoStyle && overrides) {
          Object.assign(pseudoStyle, overrides)
        }
      }

      // merge any user-defined pseudo style
      if (typeof extraStyle === 'object' || typeof extraStyle === 'function') {
        let styles = typeof extraStyle === 'function' ? extraStyle(theme, previous) : extraStyle
        pseudoStyle = pseudoStyle || {}
        Object.assign(pseudoStyle, styles)
      }

      // we conditionally apply it here...
      if (pseudoStyle && pseudoKey) {
        styles = styles || {}
        styles[pseudoKey] = pseudoStyle
      }

      // ... but either way, we allow users to "force" it on
      // (this could also be an optional parameter)
      const booleanOn = forceOnProp && theme[forceOnProp] === true

      if (pseudoStyle && booleanOn) {
        styles = styles || {}
        Object.assign(styles, pseudoStyle)
      }
    }

    return mergeStyles(previous, styles)
  }
  return themeFn
}

function getPseudoStyles(theme: Object, props: Object, useTheme: boolean) {
  let styles: any = null
  let overrides: Object | null = null
  for (const key in theme) {
    if (isDefined(props[name])) {
      const val = theme[name]
      styles = styles || {}
      styles[key] = val
      overrides = overrides || {}
      overrides[key] = val
    } else if (useTheme && isDefined(theme[name])) {
      styles = styles || {}
      styles[key] = theme[name]
    }
  }
  return { styles, overrides }
}
