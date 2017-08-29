console.log('Starting API...')
let i = 0

require('isomorphic-fetch')
console.log(++i)
const betterStackTraces = require('better-stack-traces')
console.log(++i)
const cleanStack = require('clean-stacktrace')
console.log(++i)
const global = require('global')
console.log(++i)
const wfp = require('wait-for-port')
console.log(++i)
const Constants = require('~/constants')
console.log(++i)
const promisify = require('sb-promisify').default
console.log(++i)
const waitForPort = promisify(wfp)
console.log(++i)

// betterStackTraces.register()

if (process.env.NODE_ENV !== 'production') {
  // long stack traces
  require('longjohn')
}

// bootstrap process
process.title = 'orbit-api'

var path = require('path')
var stack = stack =>
  cleanStack(stack, line => {
    var m = /.*\((.*)\).?/.exec(line) || []
    return m[1] ? line.replace(m[1], path.relative(process.cwd(), m[1])) : line
  })

process.on('UnhandledRejection', reason => {
  console.error('unhandledRejection', reason)
  console.log(stack(reason.stack))
})
process.on('UncaughtException', error => {
  console.error('uncaughtException', error)
  console.log(stack(error.stack))
})
console.log(++i)

console.log('require api')
const API = require('./api').default
console.log('done require api')

async function run() {
  console.log('Running...')
  const Api = new API({ rootPath: __dirname })
  console.log('Waiting for Couch & Redis...')
  await Promise.all([
    waitForPort(Constants.DB_HOSTNAME, Constants.DB_PORT),
    waitForPort(Constants.REDIS_HOSTNAME, Constants.REDIS_PORT),
  ])
  await Api.start()
  console.log('API started')
  global.API = Api
}

console.log(++i)

run()
