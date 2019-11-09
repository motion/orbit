import { validCSSAttributeExtra } from './validCSSAttributeExtra'

/**
 * Low byte version for browsers
 */

const allCSSAttr = {}
// add standard ones
if (typeof document !== 'undefined') {
  for (const key in document.body.style) {
    // for some reason chrome has 0-11 as valid css attributes
    if (+key === +key) continue
    allCSSAttr[key] = true
  }
}

export default {
  ...allCSSAttr,
  ...validCSSAttributeExtra,
}
