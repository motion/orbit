if (process.env.NODE_ENV !== 'production') {
  // long stack traces
  require('longjohn')
}

const API = require('./api').default

console.log('starting api')
const Api = new API({ rootPath: __dirname })

Api.start()
