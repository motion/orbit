export function startDevelopment(appRoot) {
  Error.stackTraceLimit = Infinity
  console.log(`$ NODE_ENV=${process.env.NODE_ENV} run desktop`)

  require('source-map-support/register')
  require('./installGlobals')

  process.on('uncaughtException', err => {
    console.warn('uncaughtException', err)
  })
  process.on('unhandledRejection', function(reason, promise) {
    if (reason) {
      if (reason.code === 'SQLITE_BUSY') {
        console.log('sqlite busy!')
      }
    }
    console.warn('Desktop: Possibly Unhandled Rejection', reason)
  })
}
