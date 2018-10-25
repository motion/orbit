import toColor from '@mcro/color'

// mutate styles to have alpha if defined in props

export function alphaColor(styles, { alpha, alphaHover }) {
  const { color } = styles
  if (color) {
    if (color !== 'inherit') {
      const clr = toColor(color)
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
