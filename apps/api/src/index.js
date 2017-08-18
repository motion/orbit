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

console.log('starting api')
const Api = new API({ rootPath: __dirname })

Api.start()
