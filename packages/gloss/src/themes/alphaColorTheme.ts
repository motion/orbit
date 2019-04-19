import { toColor } from '@o/color'
import { CSSPropertySet } from '@o/css'
import { ThemeFn } from '../gloss'
import { mergeStyles } from '../helpers/mergeStyles'

// mutate styles to have alpha if defined in props

export type AlphaColorProps = {
  applyPsuedoColors?: boolean
  alpha?: number
  alphaHover?: number
  hoverStyle?: {
    color?: any
    alpha?: any
  }
  activeStyle?: {
    color?: any
    alpha?: any
  }
}

export const alphaColorTheme: ThemeFn = (props, theme, previous) => {
  const color = props.color || theme.color
  const alpha = props.alpha || theme.alpha
  const next: CSSPropertySet | null = {}

  if (color) {
    if (color !== 'inherit' && typeof alpha === 'number') {
      next.color = `${toColor(color).alpha(alpha)}`
    } else {
      next.color = color
    }
  }

  if (props.applyPsuedoColors) {
    mergePsuedoColors(
      '&:hover',
      'hoverStyle',
      'colorHover',
      'alphaHover',
      next,
      color,
      props,
      theme,
    )
    mergePsuedoColors(
      '&:active',
      'activeStyle',
      'colorActive',
      'alphaActive',
      next,
      color,
      props,
      theme,
    )
  }

  return mergeStyles(previous, next)
}

function mergePsuedoColors(
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
        color: `${toColor(color).alpha(alpha)}`,
      }
    } else if (parentColor !== color) {
      next[key] = {
        color: color,
      }
    }
  }
}
