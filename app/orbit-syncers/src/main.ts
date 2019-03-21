import { once } from 'lodash'
import { syncersRoot } from './OrbitSyncersRoot'

console.log("set up global")
declare const GLOBAL: typeof global
;(GLOBAL as any).window = global
;(global as any).window = global
console.log("checking what windows is", window)

process.on('unhandledRejection', error => {
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
