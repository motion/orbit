const valFor = state => (props, key) =>
  state === 'base'
    ? props[key]
    : (props[state] && props[state][key]) || props.theme[state][key]

const states = {
  // pseudoclasses
  hover: '&:hover',
  active: '&:active',
  checked: '&:checked',
  focus: '&:focus',
  enabled: '&:enabled',
  disabled: '&:disabled',
  empty: '&:empty',
  target: '&:target',
  required: '&:required',
  valid: '&:valid',
  invalid: '&:invalid',
  // psuedoelements
  before: '&:before',
  after: '&:after',
  placeholder: '&:placeholder',
  selection: '&:selection',
}

const cssAttributeNames = document.body.style
const validCSSAttr = key => typeof cssAttributeNames[key] === 'string'

// resolves props into styles for valid css
// supports hover={{ background: 'green' }} and other states as well

export default props => {
  const styles = {}
  const getVal = valFor('base')
  // loop over props turning into styles
  for (const key of Object.keys(props)) {
    if (validCSSAttr(key)) {
      styles[key] = getVal(props, key)
      continue
    }
    // :hover, etc
    const stateKey = states[key]
    if (stateKey) {
      styles[stateKey] = {}
      const getStateVal = valFor(key)
      const val = props[key]
      for (const subKey of Object.keys(val)) {
        if (validCSSAttr(subKey)) {
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
