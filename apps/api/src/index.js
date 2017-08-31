import 'source-map-support/register'
import 'isomorphic-fetch'
import global from 'global'
import wfp from 'wait-for-port'
import * as Constants from '~/constants'
import promisify from 'sb-promisify'
import cleanStack from 'clean-stacktrace'

const waitForPort = promisify(wfp)

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
  console.log(stack(reason.stack))
})

// bootstrap process
process.title = 'orbit-api'

const API = require('./api').default

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
