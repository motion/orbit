const debug = require('./_/debug').default
const root = require('global')

// @ts-ignore
if (!root.debug) {
  // @ts-ignore
  root.debug = debug
}
