import { validCSSAttributeExtra } from './validCSSAttributeExtra'

/**
 * Low byte version for browsers
 */

const allCSSAttr = {}
// add standard ones
if (typeof document !== 'undefined') {
  for (const key in document.body.style) {
    allCSSAttr[key] = true
  }
}

export default {
  ...allCSSAttr,
  ...validCSSAttributeExtra,
}
