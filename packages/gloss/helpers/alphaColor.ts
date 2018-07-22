import toColor from '@mcro/color'

// mutate styles to have alpha if defined in props

export function alphaColor(styles, props) {
  if (props.alpha && styles.color) {
    if (props.alpha >= 0 && props.color !== 'inherit') {
      styles.color = `${toColor(styles.color).alpha(props.alpha)}`
    }
  }
  return styles
}
