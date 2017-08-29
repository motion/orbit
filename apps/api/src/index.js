console.log('Starting API...')

require('isomorphic-fetch')
const betterStackTraces = require('better-stack-traces')
const cleanStack = require('clean-stacktrace')
const global = require('global')
const wfp = require('wait-for-port')
const Constants = require('~/constants')
const promisify = require('sb-promisify').default
const waitForPort = promisify(wfp)

betterStackTraces.register()

if (process.env.NODE_ENV !== 'production') {
  require('longjohn') // long stack traces
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

run()
