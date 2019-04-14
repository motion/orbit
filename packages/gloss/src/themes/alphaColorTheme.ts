import { toColor } from '@o/color'
import { CSSPropertySet } from '@o/css'
import { GlossThemeFn } from '../gloss'
import { mergeStyles } from '../helpers/mergeStyles'

// mutate styles to have alpha if defined in props

export type AlphaColorProps = {
  alpha?: number
  alphaHover?: number
  hoverStyle?: {
    color?: any
    alpha?: any
  }
}

export const alphaColorTheme: GlossThemeFn<any> = (props, theme, previous) => {
  const color = props.color || theme.color
  const alpha = props.alpha || theme.alpha
  const hoverColor =
    (props.hoverStyle && props.hoverStyle.color) || props.hoverColor || theme.colorHover || color
  const hoverAlpha =
    (props.hoverStyle && props.hoverStyle.alpha) || props.alphaHover || theme.alphaHover

  let next: CSSPropertySet | null = null

  if (color) {
    next = next || {}
    if (color !== 'inherit' && typeof alpha === 'number') {
      next.color = `${toColor(color).alpha(alpha)}`
    } else {
      next.color = color
    }
  }

  if (hoverColor) {
    next = next || {}
    if (hoverColor !== 'inherit' && typeof hoverAlpha === 'number') {
      next['&:hover'] = {
        color: `${toColor(hoverColor).alpha(hoverAlpha)}`,
      }
    } else if (color !== hoverColor) {
      next['&:hover'] = {
        color: hoverColor,
      }
    }
  }

  return mergeStyles(previous, next)
}
