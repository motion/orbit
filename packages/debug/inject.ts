const mcroDebug = require('./index')
const root = require('global')

if (!root.debug) {
  root.debug = mcroDebug
}
