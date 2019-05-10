import { CSSPropertySet } from '@o/css'

import { Config } from '../config'
import { ThemeFn } from '../gloss'
import { mergeStyles } from '../helpers/mergeStyles'
import { PseudoStyleProps } from './psuedoStyleTheme'

// mutate styles to have alpha if defined in props

export type AlphaColorProps = {
  applyPsuedoColors?: boolean
  alpha?: number
  alphaHover?: number
  hoverStyle?: PseudoStyleProps['hoverStyle']
  activeStyle?: PseudoStyleProps['activeStyle']
  focusStyle?: PseudoStyleProps['focusStyle']
}

export const alphaColorTheme: ThemeFn = (props, theme, previous) => {
  const color = props.color || theme.color
  const alpha = props.alpha || theme.alpha
  const next: CSSPropertySet | null = {}

  if (color) {
    if (color !== 'inherit' && typeof alpha === 'number') {
      next.color = `${Config.toColor(color).alpha(alpha)}`
    } else {
      next.color = color
    }
  }

  if (props.applyPsuedoColors) {
    merge('&:focus', 'focusStyle', 'colorFocus', 'alphaFocus', next, color, props, theme)
    merge('&:hover', 'hoverStyle', 'colorHover', 'alphaHover', next, color, props, theme)
    merge('&:active', 'activeStyle', 'colorActive', 'alphaActive', next, color, props, theme)
  }

  return mergeStyles(previous, next)
}

function merge(
  key: string,
  styleKey: string,
  colorKey: string,
  alphaKey,
  next,
  parentColor,
  props,
  theme,
) {
  const color = (props[styleKey] && props[styleKey].color) || theme[colorKey] || parentColor
  const alpha = (props[styleKey] && props[styleKey].alpha) || theme[alphaKey]

  if (color) {
    if (color !== 'inherit' && typeof alpha === 'number') {
      next[key] = {
        color: `${Config.toColor(color).alpha(alpha)}`,
      }
    } else if (parentColor !== color) {
      next[key] = {
        color: color,
      }
    }
  }
}
