import 'regenerator-runtime'
import 'source-map-support/register'
import 'isomorphic-fetch'
import global from 'global'
import cleanStack from 'clean-stacktrace'

process.on('unhandledRejection', function(error, p) {
  const path = require('path')
  const stack = stack =>
    cleanStack(stack, line => {
      const m = /.*\((.*)\).?/.exec(line) || []
      return m[1]
        ? line.replace(m[1], path.relative(process.cwd(), m[1]))
        : line
    })
  console.log('PromiseFail:')
  if (error.stack) {
    try {
      console.log(error.message)
      console.log(stack(error.stack))
    } catch (e) {
      console.log(e.message, e.stack)
      console.log('errr', error.stack)
    }
  } else {
    console.log(error)
  }
})

// bootstrap process
process.title = 'orbit-api'

const API = require('./api').default

async function run() {
  const Api = new API()
  global.API = Api
  try {
    await Api.start()
  } catch (err) {
    console.log('error', err)
  }
}

run()
