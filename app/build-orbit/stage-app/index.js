var orbit = require('@mcro/orbit')
var version = require('../package.json').version

console.log('Starting Orbit version', version)

orbit.main({
  version,
})
