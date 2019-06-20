import { OrbitAppsManager } from '@o/libs-node'
import { WorkerOptions } from '@o/worker-kit'
import { reaction } from 'mobx'

import { Syncer } from './Syncer'

const orbitAppsManager = new OrbitAppsManager()

reaction(
  () => orbitAppsManager.nodeAppDefinitions,
  nodeDefinitions => {
    console.log('i see nodeDefinitions, update syncers', nodeDefinitions)
  },
)

export const syncers: WorkerOptions[] = []

export const Syncers = []

syncers.forEach(app => {
  Syncers.push(
    new Syncer({
      id: app.id,
      name: app.name,
      appIdentifier: app.id,
      runner: app.runner,
      interval: app.interval,
    }),
  )
})
