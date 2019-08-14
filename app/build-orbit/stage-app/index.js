// enforce production env
process.env.NODE_ENV = 'production'
process.env.ORBIT_VERSION = JSON.parse(require('fs').readFileSync('./package.json', 'utf8')).version

console.log('Starting Orbit version', process.env.ORBIT_VERSION)

require('@o/orbit-main').main()
