import { toColor } from '@o/color'
import { CSSPropertySet, CSSPropertySetStrict } from '@o/css'

import { Config } from '../configureGloss'
import { ThemeFn } from '../gloss'
import { mergeStyles } from '../helpers/mergeStyles'
import { unwrapProps } from '../theme/useTheme'
import { ColorLike } from '../types'

// mutate styles to have alpha if defined in props

export type PseudoStyle = CSSPropertySetStrict & { alpha?: number } | null | false

export type PseudoStyleProps = {
  hoverStyle?: PseudoStyle
  activeStyle?: PseudoStyle
  focusStyle?: PseudoStyle
  disabledStyle?: PseudoStyle
  focusWithinStyle?: PseudoStyle
  selectedStyle?: PseudoStyle
}

export type AlphaColorProps = {
  applyPsuedoColors?: boolean | 'only-if-defined'
  applyThemeColor?: boolean
  alpha?: number
  alphaHover?: number
  hoverStyle?: PseudoStyleProps['hoverStyle']
  activeStyle?: PseudoStyleProps['activeStyle']
  focusStyle?: PseudoStyleProps['focusStyle']
  disabledStyle?: PseudoStyleProps['disabledStyle']
  focusWithinStyle?: PseudoStyleProps['focusWithinStyle']
  selectedStyle?: PseudoStyleProps['selectedStyle']
}

const mergeFocus = merge.bind(null, 'focusStyle', 'colorFocus', 'alphaFocus')
const mergeHover = merge.bind(null, 'hoverStyle', 'colorHover', 'alphaHover')
const mergeActive = merge.bind(null, 'activeStyle', 'colorActive', 'alphaActive')
const mergeDisabled = merge.bind(null, 'disabledStyle', 'colorDisabled', 'alphaDisabled',)

export const alphaColorTheme: ThemeFn<AlphaColorProps> = (props, previous) => {
  let color = props.color as any
  const alpha = props.alpha
  let next: CSSPropertySet | null = null
  if (color) {
    if (props.applyThemeColor) {
      if (
        color.originalInput !== 'inherit' &&
        typeof alpha === 'number'
      ) {
        next = next || {}
        next.color = toColor(color).setAlpha(alpha)
      } else {
        next = next || {}
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
    next = next || {}
    mergeFocus(next, color, props)
    mergeHover(next, color, props)
    mergeActive(next, color, props)
    mergeDisabled(next, color, props)
  }
  if (next) {
    mergeStyles(unwrapProps(props), next, previous)
  }
}

function merge(
  pseudoKey: string,
  colorKey: string,
  alphaKey: string,
  next: Object,
  baseColor: ColorLike,
  props: AlphaColorProps,
) {
  const color = props[pseudoKey]?.color ?? props[colorKey] ?? baseColor
  const alpha = props[pseudoKey]?.alpha ?? props[alphaKey]
  if (color) {
    if (color !== 'inherit' && typeof alpha === 'number') {
      next[pseudoKey] = {
        color: Config.toColor(color).setAlpha(alpha),
      }
    } else if (baseColor !== color) {
      next[pseudoKey] = {
        color: color,
      }
    }
  }
}
