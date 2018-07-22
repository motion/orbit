import { validCSSAttr, CSSPropertySet } from '@mcro/css'
import toColor from '@mcro/color'

// resolves props into styles for valid css

export const propsToStyles = props => {
  const styles: CSSPropertySet = {
    ...props.style,
  }
  // loop over props turning into styles
  for (const key in props) {
    // &:hover, etc
    if (key[0] === '&') {
      styles[key] = props[key]
    } else if (validCSSAttr[key]) {
      styles[key] = props[key]
    }
    // alpha effects on colors
    if (key === 'color' && styles.color) {
      if (typeof props.alpha === 'number' && props.color !== 'inherit') {
        styles.color = `${toColor(styles.color).alpha(props.alpha)}`
      }
    }
  }
  return styles
}
