import { Logger } from '@o/logger'
import { once } from 'lodash'

if (!global['require'].__islaxied) {
  console.error('ERROR ERRORERRORERRORERRORERRORERRORERRORERRORERRORERRORERRORERRORERROR')
  process.exit(1)
}

const { workersRoot } = require('./OrbitWorkersRoot')

const log = new Logger('orbit-workers')

process.on('unhandledRejection', (error: any) => {
  console.error('unhandledRejection', error.stack)
  // process.exit(1)
})

process.on('uncaughtException', err => {
  console.error('uncaughtException', err)
  // process.exit(1)
})

export async function main() {
  log.info('start workers')

  if (process.env.NODE_ENV === 'development') {
    require('./startDevelopment').startDevelopment(workersRoot)
  }

  const dispose = once(() => {
    log.info('Workers exiting...')
    workersRoot.dispose()
  })
  process.on('exit', dispose)
  process.on('SIGINT', dispose)
  process.on('SIGSEGV', dispose)
  process.on('SIGTERM', dispose)
  process.on('SIGQUIT', dispose)

  await workersRoot.start()
  return dispose
}
