import global from 'global'

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
  await Api.start()
  console.log('API started')

  global.API = Api
}

run()
