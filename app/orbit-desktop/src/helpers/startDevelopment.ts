import { COSAL_DB } from '../constants'
import { removeSync } from 'fs-extra'

export function startDevelopment(appRoot) {
  Error.stackTraceLimit = Infinity
  console.log(`$ NODE_ENV=${process.env.NODE_ENV} run desktop`)

  require('source-map-support/register')
  require('./installGlobals').installGlobals(appRoot)

  if (process.env.RESET_COSAL === 'true') {
    console.log('REMOVING OLD COSAL_DB in development mode', COSAL_DB)
    removeSync(COSAL_DB)
  }

  process.on('uncaughtException', err => {
    console.warn('uncaughtException', err)
  })

  process.on('unhandledRejection', function(reason) {
    console.log(
      `Desktop: Possibly Unhandled Rejection:
    ${reason.message}
    ${reason.stack}`,
    )
  })
}
