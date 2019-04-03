import { toColor } from '@o/color'
import { CSSPropertySet } from '@o/css'

// mutate styles to have alpha if defined in props

export type AlphaColorProps = {
  alpha?: number
  alphaHover?: number
}

export function alphaColor(styles, { alpha, alphaHover }: AlphaColorProps): CSSPropertySet {
  if (styles.color) {
    if (styles.color !== 'inherit') {
      const clr = toColor(styles.color)
      if (typeof alpha === 'number') {
        styles.color = `${clr.alpha(alpha)}`
      }
      if (typeof alphaHover === 'number') {
        styles['&:hover'] = {
          ...styles['&:hover'],
          color: `${clr.alpha(alphaHover)}`,
        }
      }
    }
  }
  return styles
}
