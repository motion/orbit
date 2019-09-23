import { CAMEL_TO_SNAKE } from './cssNameMap'

export const validCSSAttributeExtra = {
  borderLeftRadius: true,
  borderRightRadius: true,
  borderBottomRadius: true,
  borderTopRadius: true,
  // lets ignore the obviously-html props
  // this is tied into the logic in gloss.tsx#glossify/render
  // where we dont pass down the css props. if we did, we dont want this
  src: false,
}

for (const key in CAMEL_TO_SNAKE) {
  validCSSAttributeExtra[key] = true
}
