import { CSSPropertySet } from '@o/css'

import { Config } from '../config'
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

export const alphaColorTheme: ThemeFn = (props, theme, previous) => {
  const color = props.color || theme.color
  const alpha = selectDefined(props.alpha, theme.alpha)
  const next: CSSPropertySet | null = {}
  if (color) {
    if (color !== 'inherit' && typeof alpha === 'number') {
      next.color = Config.toColor(color).setAlpha(alpha)
    } else {
      next.color = color
    }
  }
  const applyPsuedos = props.applyPsuedoColors
  if (
    applyPsuedos === true ||
    (applyPsuedos === 'only-if-defined' &&
      (!!props.hoverStyle || !!props.activeStyle || !!props.focusStyle || !!props.disabledStyle))
  ) {
    mergeFocus(next, color, props, theme)
    mergeHover(next, color, props, theme)
    mergeActive(next, color, props, theme)
    mergeDisabled(next, color, props, theme)
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
        color: `${Config.toColor(color).setAlpha(alpha)}`,
      }
    } else if (parentColor !== color) {
      next[key] = {
        color: color,
      }
    }
  }
}

function selectDefined(...args: any[]) {
  for (const arg of args) {
    if (arg !== undefined) {
      return arg
    }
  }
}
