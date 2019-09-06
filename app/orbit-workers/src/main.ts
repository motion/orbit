import { Logger } from '@o/logger'
import root from 'global'
import { once } from 'lodash'

// lazy imports for safety/speed (@o/kit is huge, etc)
if (!root.require.__proxiedRequire) {
  const lazy = require('laxy')
  root.require = lazy(require)
  root.require.__proxiedRequire = true
  global['require'] = root.require
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
