import toColor from '@mcro/color'
import { psuedoKeys } from '@mcro/gloss'

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

// special @mcro/css attributes
const validCSSAttr = {
  borderLeftRadius: true,
  borderRightRadius: true,
  borderBottomRadius: true,
  borderTopRadius: true,
}

// add standard ones
for (const key of Object.keys(document.body.style)) {
  validCSSAttr[key] = true
}

// add gloss special ones

// resolves props into styles for valid css
// supports hover={{ background: 'green' }} and other states as well

export const propsToStyles = props => {
  const styles = {}
  const getVal = valFor('base')
  // loop over props turning into styles
  for (const key of Object.keys(props)) {
    if (validCSSAttr[key]) {
      styles[key] = getVal(props, key)
      continue
    }
    // &:hover, etc
    if (psuedoKeys[key]) {
      const stateKey = key
      styles[stateKey] = {}
      const getStateVal = valFor(key)
      const val = props[key]
      if (!val) {
        throw new Error(`Bad val for ${key} ${JSON.stringify(val)}`)
      }
      for (const subKey of Object.keys(val)) {
        if (validCSSAttr[subKey]) {
          styles[stateKey][subKey] = getStateVal(props, subKey)
        } else {
          console.log('propStyles error info', styles, props)
          throw new Error(`Invalid name for css key: ${key}`)
        }
      }
      continue
    }
  }
  return styles
}
