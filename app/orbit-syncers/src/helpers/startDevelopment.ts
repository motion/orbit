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
      console.log('error killing', err)
    }
  }

  process.on('exit', exitHandler)
  process.on('uncaughtException', err => {
    console.log('uncaughtException', err)
  })
  process.on('unhandledRejection', function(reason, promise) {
    if (reason) {
      if (reason.code === 'SQLITE_BUSY') {
        console.log('sqlite busy!')
      }
    }
    console.log('Desktop: Possibly Unhandled Rejection')
    console.log(promise, reason)
    console.log(reason.stack)
  })
}
