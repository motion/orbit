// enforce production env
process.env.NODE_ENV = 'production'
process.env.ORBIT_VERSION = JSON.parse(require('fs').readFileSync('./package.json', 'utf8')).version
process.env.FIRST_RUN = 'true'

console.log('Starting Orbit version', process.env.ORBIT_VERSION)

require('@mcro/orbit').main()
