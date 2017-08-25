import 'isomorphic-fetch'
import global from 'global'
import wfp from 'wait-for-port'
import * as Constants from '~/constants'
import promisify from 'sb-promisify'
const waitForPort = promisify(wfp)

if (process.env.NODE_ENV !== 'production') {
  // long stack traces
  require('longjohn')
}

// bootstrap process
process.title = 'orbit-api'
process.on('unhandledRejection', reason => {
  console.error('unhandledRejection', reason)
  console.log(reason.stack)
})
process.on('uncaughtException', error => {
  console.error('uncaughtException', error && error.stack)
})

const API = require('./api').default

async function run() {
  console.log('Starting API...')
  const Api = new API({ rootPath: __dirname })
  console.log('Waiting for Couch & Redis...')
  await waitForPort(Constants.DB_HOSTNAME, Constants.DB_PORT)
  await waitForPort(Constants.REDIS_HOSTNAME, Constants.REDIS_PORT)
  await Api.start()
  console.log('API started')
  global.API = Api
}

run()
