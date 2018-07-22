import toColor from '@mcro/color'

// mutate styles to have alpha if defined in props

export function alphaColor(styles, alpha) {
  if (alpha >= 0 && styles.color) {
    if (styles.color !== 'inherit') {
      styles.color = `${toColor(styles.color).alpha(alpha)}`
    }
  }
  return styles
}
