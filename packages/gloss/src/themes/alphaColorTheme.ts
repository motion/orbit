import { toColor } from '@o/color'
import { CSSPropertySet } from '@o/css'

import { Config } from '../configureGloss'
import { ThemeFn } from '../gloss'
import { mergeStyles } from '../helpers/mergeStyles'
import { PseudoStyleProps } from './psuedoStyleTheme'

// mutate styles to have alpha if defined in props

export type AlphaColorProps = {
  applyPsuedoColors?: boolean | 'only-if-defined'
  alpha?: number
  alphaHover?: number
  hoverStyle?: PseudoStyleProps['hoverStyle']
  activeStyle?: PseudoStyleProps['activeStyle']
  focusStyle?: PseudoStyleProps['focusStyle']
  disabledStyle?: PseudoStyleProps['disabledStyle']
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
    const color = props.color
    const alpha = props.alpha
    const next: CSSPropertySet | null = {}
    if (color) {
      if (color.originalInput !== 'inherit' && typeof alpha === 'number') {
        next.color = toColor(color).setAlpha(alpha)
      } else {
        if (shouldSetDefault) {
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
      const res = mergeStyles(previous, next)
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
