// shims
import 'core-js'

// TODO remove once node 7+ works, depends on nodemon
// Object.entries = require('object.entries')
// Object.values = require('object.values')
// Object.getOwnPropertyDescriptors = require('object.getownpropertydescriptors')

if (process.env.NODE_ENV !== 'production') {
  // long stack traces
  require('longjohn')
}

// bootstrap process
process.title = 'orbit-api'
process.on('unhandledRejection', reason => {
  console.error('unhandledRejection', reason)
})
process.on('uncaughtException', error => {
  console.error('uncaughtException', error && error.stack)
})

const API = require('./api').default

async function run() {
  console.log('Starting API...')
  const Api = new API({ rootPath: __dirname })
  await Api.start()
  console.log('API started')
}

run()
