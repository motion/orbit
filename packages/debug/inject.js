const debug = require('./index')
const global = require('global')

if (global.debug) {
  throw new Error(`Already defined debug!`)
}

global.debug = debug
