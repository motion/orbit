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

export const alphaColorTheme: GlossThemeFn<any> = (props, theme, previous): CSSPropertySet => {
  const color = props.color || theme.color
  const alpha = props.alpha || theme.alpha
  const hoverColor =
    (props.hoverStyle && props.hoverStyle.color) || props.hoverColor || theme.colorHover
  const hoverAlpha =
    (props.hoverStyle && props.hoverStyle.alpha) || props.alphaHover || theme.alphaHover

  const next: CSSPropertySet = {}

  if (color !== 'inherit') {
    if (typeof alpha === 'number') {
      next.color = `${toColor(color).alpha(alpha)}`
    }
    if (typeof hoverAlpha === 'number') {
      next['&:hover'] = {
        color: `${toColor(hoverColor).alpha(hoverAlpha)}`,
      }
    }
  }

  return mergeStyles(previous, next)
}
