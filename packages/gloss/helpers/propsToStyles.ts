import { validCSSAttr, CSSPropertySet } from '@mcro/css'
import { alphaColor } from './alphaColor'

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
  }
  return alphaColor(styles, props)
}
