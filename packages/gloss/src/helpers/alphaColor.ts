import { color } from '@mcro/color'

// mutate styles to have alpha if defined in props

export function alphaColor(styles, { alpha, alphaHover }) {
  if (styles.color) {
    if (styles.color !== 'inherit') {
      const clr = color(styles.color)
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
