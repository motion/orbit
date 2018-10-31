export function startDevelopment(appRoot) {
  Error.stackTraceLimit = Infinity

  console.log(`$ NODE_ENV=${process.env.NODE_ENV} run syncers`)

  require('source-map-support/register')

  const exitHandler = async (code?: any) => {
    console.log('handling exit', code)
    try {
      if (await appRoot.dispose()) {
        // otherwise it wont exit :/
        process.kill(process.pid)
      }
    } catch (err) {
      console.error('error killing', err)
    }
  }

  process.on('exit', exitHandler)
  process.on('uncaughtException', err => {
    console.error('uncaughtException', err)
  })
  process.on('unhandledRejection', function(reason, promise) {
    if (reason) {
      if (reason.code === 'SQLITE_BUSY') {
        console.log('sqlite busy!')
      }
    }
    console.error('Desktop: Possibly Unhandled Rejection')
    console.error(promise, reason)
    console.error(reason.stack)
  })
}
