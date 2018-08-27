// enforce production env
process.env.NODE_ENV = 'production'
process.env.ORBIT_VERSION = require('./package.json').version

console.log('Starting Orbit version', process.env.ORBIT_VERSION)

require('@mcro/orbit')
