import { removeSync } from 'fs-extra'
import { COSAL_DB } from '../constants'
import { OrbitDesktopRoot } from '../OrbitDesktopRoot'

export function startDevelopment(appRoot: OrbitDesktopRoot) {
  Error.stackTraceLimit = Infinity
  console.log(`$ NODE_ENV=${process.env.NODE_ENV} run desktop`)

  require('source-map-support/register')
  require('./installGlobals').installGlobals(appRoot)

  if (process.env.RESET_COSAL === 'true') {
    console.log('REMOVING OLD COSAL_DB in development mode', COSAL_DB)
    removeSync(COSAL_DB)
  }

  process.on('uncaughtException', err => {
    console.error('uncaughtException', err)
    process.exit(1)
  })

  process.on('unhandledRejection', function(reason: any) {
    console.log(
      `Desktop: Possibly Unhandled Rejection:
    ${reason.message}
    ${reason.stack}`,
    )
    process.exit(1)
  })
}
