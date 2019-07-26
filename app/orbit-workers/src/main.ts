import { once } from 'lodash'

const root = global as any
root.window = global

const { workersRoot } = require('./OrbitWorkersRoot')

process.on('unhandledRejection', (error: any) => {
  console.log('unhandledRejection', error.stack)
  process.exit(1)
})

process.on('uncaughtException', err => {
  console.error('uncaughtException', err)
  process.exit(1)
})

export async function main() {
  console.log('start workers')

  if (process.env.NODE_ENV === 'development') {
    require('./startDevelopment').startDevelopment(workersRoot)
  }

  const dispose = once(() => {
    console.log('Workers exiting...')
    workersRoot.dispose()
  })
  process.on('exit', dispose)

  await workersRoot.start()
  return dispose
}
