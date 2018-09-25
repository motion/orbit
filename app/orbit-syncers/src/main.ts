import 'isomorphic-fetch'
import { once } from 'lodash'
import { OrbitSyncersRoot } from './OrbitSyncersRoot'

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.stack)
  throw error
})

export async function main() {
  const root = new OrbitSyncersRoot()

  if (process.env.NODE_ENV === 'development') {
    require('./helpers/startDevelopment').startDevelopment(root)
  }

  const dispose = once(() => {
    console.log('Syncers exiting...')
    root.dispose()
  })
  process.on('exit', dispose)

  await root.start()
  return dispose
}
