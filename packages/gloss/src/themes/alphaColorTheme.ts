import { toColor } from '@o/color'
import { CSSPropertySet, CSSPropertySetStrict } from '@o/css'

import { Config } from '../configureGloss'
import { ThemeFn } from '../gloss'
import { mergeStyles } from '../helpers/mergeStyles'

// mutate styles to have alpha if defined in props

export type PseudoStyleProps = {
  hoverStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null
  activeStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null
  focusStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null
  disabledStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null
  focusWithinStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null
  selectedStyle?: CSSPropertySetStrict & { alpha?: number } | boolean | null
}

export type AlphaColorProps = {
  applyPsuedoColors?: boolean | 'only-if-defined'
  alpha?: number
  alphaHover?: number
  hoverStyle?: PseudoStyleProps['hoverStyle']
  activeStyle?: PseudoStyleProps['activeStyle']
  focusStyle?: PseudoStyleProps['focusStyle']
  disabledStyle?: PseudoStyleProps['disabledStyle']
  focusWithinStyle?: PseudoStyleProps['focusWithinStyle']
  selectedStyle?: PseudoStyleProps['selectedStyle']
}

const mergeFocus = merge.bind(null, '&:focus', 'focusStyle', 'colorFocus', 'alphaFocus')
const mergeHover = merge.bind(null, '&:hover', 'hoverStyle', 'colorHover', 'alphaHover')
const mergeActive = merge.bind(null, '&:active', 'activeStyle', 'colorActive', 'alphaActive')
const mergeDisabled = merge.bind(
  null,
  '&:disabled',
  'disabledStyle',
  'colorDisabled',
  'alphaDisabled',
)

export const alphaColorTheme = createAlphaColorTheme(true)
export const alphaColorThemeLoose = createAlphaColorTheme(false)

function createAlphaColorTheme(shouldSetDefault = false) {
  const themeFn: ThemeFn<AlphaColorProps> = (props, previous) => {
    let color = props.color as any
    const alpha = props.alpha
    const next: CSSPropertySet | null = {}
    if (color) {
      if (shouldSetDefault) {
        if (
          typeof color !== 'string' &&
          color.originalInput !== 'inherit' &&
          typeof alpha === 'number'
        ) {
          next.color = toColor(color).setAlpha(alpha)
        } else {
          next.color = color
        }
      }
    }
    const applyPsuedos = props.applyPsuedoColors
    if (
      applyPsuedos === true ||
      (applyPsuedos === 'only-if-defined' &&
        (!!props.hoverStyle || !!props.activeStyle || !!props.focusStyle || !!props.disabledStyle))
    ) {
      mergeFocus(next, color, props)
      mergeHover(next, color, props)
      mergeActive(next, color, props)
      mergeDisabled(next, color, props)
    }
    if (Object.keys(next).length) {
      const res = mergeStyles(next, previous)
      return res
    }
  }
  return themeFn
}

function merge(
  key: string,
  styleKey: string,
  colorKey: string,
  alphaKey: string,
  next: Object,
  parentColor,
  props,
) {
  const color = (props[styleKey] && props[styleKey].color) || props[colorKey] || parentColor
  const alpha = (props[styleKey] && props[styleKey].alpha) || props[alphaKey]
  if (color) {
    if (color !== 'inherit' && typeof alpha === 'number') {
      next[key] = {
        color: Config.toColor(color)
          .setAlpha(alpha)
          .toRgbString(),
      }
    } else if (parentColor !== color) {
      next[key] = {
        color: color,
      }
    }
  }
}
