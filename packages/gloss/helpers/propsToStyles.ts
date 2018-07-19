import { validCSSAttr } from '@mcro/css'

// resolves props into styles for valid css

export const propsToStyles = props => {
  const styles = {}
  // loop over props turning into styles
  for (const key of Object.keys(props)) {
    // &:hover, etc
    if (key[0] === '&') {
      styles[key] = props[key]
      continue
    }
    if (validCSSAttr[key]) {
      styles[key] = props[key]
      continue
    }
  }
  return styles
}
