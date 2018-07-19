import toColor from '@mcro/color'
import { psuedoKeys, validCSSAttr } from '@mcro/gloss'

const valFor = state => (props, key) => {
  let value = state === 'base' ? props[key] : props[state] && props[state][key]
  if (typeof value === 'undefined') {
    value = props.theme[state][key]
  }
  // alpha effects on colors
  if (key === 'color') {
    if (typeof props.alpha === 'number' && value !== 'inherit') {
      value = toColor(value).alpha(props.alpha)
    }
  }
  return value
}

// add gloss special ones

// resolves props into styles for valid css
// supports hover={{ background: 'green' }} and other states as well

export const propsToStyles = props => {
  const styles = {}
  const getVal = valFor('base')
  // loop over props turning into styles
  for (const key of Object.keys(props)) {
    // &:hover, etc
    if (key[0] === '&') {
      styles[key] = props[key]
      continue
    }
    if (validCSSAttr[key]) {
      styles[key] = getVal(props, key)
      continue
    }
  }
  return styles
}
