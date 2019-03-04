import { once } from 'lodash'
import { syncersRoot } from './OrbitSyncersRoot'

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.stack)
  throw error
})

export async function main() {

  if (process.env.NODE_ENV === 'development') {
    require('./helpers/startDevelopment').startDevelopment(syncersRoot)
  }

  const dispose = once(() => {
    console.log('Syncers exiting...')
    syncersRoot.dispose()
  })
  process.on('exit', dispose)

  await syncersRoot.start()
  return dispose
}
