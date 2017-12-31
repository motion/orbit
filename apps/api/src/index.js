import 'isomorphic-fetch'

const IS_DEV = process.env.NODE_ENV === 'development'

if (IS_DEV) {
  require('source-map-support/register')
}

if (!process.env.HAS_BABEL_POLYFILL) {
  require('babel-polyfill')
}

process.on('unhandledRejection', function(reason, promise) {
  console.log(
    'API: Possibly Unhandled Rejection at: Promise ',
    promise,
    ' reason: ',
    reason,
  )
  console.log(reason.stack)
})

const API = require('./api').default

export async function run() {
  const Api = new API()
  try {
    await Api.start()
  } catch (err) {
    console.log('error', err)
  }
}
