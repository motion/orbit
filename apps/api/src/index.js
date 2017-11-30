import 'isomorphic-fetch'
import cleanStack from 'clean-stacktrace'

const IS_DEV = process.env.NODE_ENV === 'development'

if (IS_DEV) {
  require('source-map-support/register')
}

if (!process.env.HAS_BABEL_POLYFILL) {
  require('babel-polyfill')
}

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

export async function run() {
  const Api = new API()
  try {
    await Api.start()
  } catch (err) {
    console.log('error', err)
  }
}
