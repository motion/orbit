import toColor from '@mcro/color'
import { validCSSAttr } from '@mcro/css'

// resolves props into styles for valid css
// backs up to theme colors if not found

// needs work...

// <Button base hover="&:hover" active="&:active" />
// will apply all theme styles from:
// theme { base: {}, hover: {}, active: {} }
// on the states normal, :hover, :active

// You can toggle them individually
// <Button background={false} hover={{ background: false }} />

export const propsToThemeStyles = props => {
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
