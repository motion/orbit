var orbit = require('@mcro/orbit')
var version = require('./package.json').version

console.log('Starting Orbit version', version)

// enforce production env
process.env.NODE_ENV = 'production'

orbit.main({
  version,
})
