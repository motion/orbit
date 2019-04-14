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
    (props.hoverStyle && props.hoverStyle.color) || props.hoverColor || theme.colorHover
  const hoverAlpha =
    (props.hoverStyle && props.hoverStyle.alpha) || props.alphaHover || theme.alphaHover

  let next: CSSPropertySet | null = null

  if (color !== 'inherit' && color && typeof alpha === 'number') {
    next = next || {}
    next.color = `${toColor(color).alpha(alpha)}`
  }

  if (hoverColor && typeof hoverAlpha === 'number') {
    next = next || {}
    next['&:hover'] = {
      color: `${toColor(hoverColor).alpha(hoverAlpha)}`,
    }
  }

  return mergeStyles(previous, next)
}
