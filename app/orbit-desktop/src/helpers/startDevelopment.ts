import { Logger } from '@o/logger'
import { removeSync } from 'fs-extra'

import { COSAL_DB } from '../constants'
import { OrbitDesktopRoot } from '../OrbitDesktopRoot'

const log = new Logger('orbit-desktop')

export function startDevelopment(appRoot: OrbitDesktopRoot) {
  Error.stackTraceLimit = Infinity
  log.info(`$ NODE_ENV=${process.env.NODE_ENV} run desktop`)

  // require('source-map-support/register')
  require('./installGlobals').installGlobals(appRoot)

  if (process.env.RESET_COSAL === 'true') {
    log.info('REMOVING OLD COSAL_DB in development mode', COSAL_DB)
    removeSync(COSAL_DB)
  }

  process.on('uncaughtException', err => {
    console.error('uncaughtException', err)
    // process.exit(1)
  })

  process.on('unhandledRejection', function(reason: any) {
    console.log(`Desktop: Possibly Unhandled Rejection: ${reason.message}\n${reason.stack}`)
    // process.exit(1)
  })
}
