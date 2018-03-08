const debug = require('./index')
const global = require('global')

if (!global.debug) {
  global.debug = debug
}
