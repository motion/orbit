import { Logger } from '@o/logger'
import { once } from 'lodash'

const root = global as any
root.window = global

const { workersRoot } = require('./OrbitWorkersRoot')

const log = new Logger('orbit-workers')

process.on('unhandledRejection', (error: any) => {
  log.info('unhandledRejection', error.stack)
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

  await workersRoot.start()
  return dispose
}
