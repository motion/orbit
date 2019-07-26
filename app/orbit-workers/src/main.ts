import { once } from 'lodash'

const root = global as any
root.window = global

const { syncersRoot } = require('./OrbitSyncersRoot')

process.on('unhandledRejection', (error: any) => {
  console.log('unhandledRejection', error.stack)
  throw error
})

export async function main() {
  console.log('start syncers')

  if (process.env.NODE_ENV === 'development') {
    require('./startDevelopment').startDevelopment(syncersRoot)
  }

  const dispose = once(() => {
    console.log('Syncers exiting...')
    syncersRoot.dispose()
  })
  process.on('exit', dispose)

  await syncersRoot.start()
  return dispose
}
