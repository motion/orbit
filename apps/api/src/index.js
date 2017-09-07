import 'source-map-support/register'
import 'isomorphic-fetch'
import global from 'global'
import wfp from 'wait-for-port'
import * as Constants from '~/constants'
import promisify from 'sb-promisify'
import cleanStack from 'clean-stacktrace'

const wfpp = promisify(wfp)
const options = {
  numRetries: 100,
  retryInterval: 3000,
}
const waitForPort = (host, port) => wfpp(host, port, options)

process.on('unhandledRejection', function(reason, p) {
  const path = require('path')
  const stack = stack =>
    cleanStack(stack, line => {
      const m = /.*\((.*)\).?/.exec(line) || []
      return m[1]
        ? line.replace(m[1], path.relative(process.cwd(), m[1]))
        : line
    })
  console.log('PromiseFail:')
  if (reason.stack) {
    try {
      console.log(stack(reason.stack))
    } catch (e) {
      console.log('errr', reason.stack, e)
    }
  } else {
    console.log(reason)
  }
})

// bootstrap process
process.title = 'orbit-api'

const API = require('./api').default

async function run() {
  console.log('Running...')
  const Api = new API({ rootPath: __dirname })
  global.API = Api
  console.log('Waiting for Couch & Redis...')
  try {
    await Promise.all([
      waitForPort(Constants.DB_HOSTNAME, Constants.DB_PORT),
      waitForPort(Constants.REDIS_HOSTNAME, Constants.REDIS_PORT),
    ])
    console.log('Connected to Couch and Redis')
    await Api.start()
  } catch (err) {
    console.log('error', err)
  }
  console.log('API started')
}

run()
