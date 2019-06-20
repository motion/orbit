import { OrbitAppsManager } from '@o/libs-node'
import { WorkerOptions } from '@o/worker-kit'
import { reaction } from 'mobx'

import { Syncer } from './Syncer'

const orbitAppsManager = new OrbitAppsManager()

reaction(
  () => orbitAppsManager.nodeAppDefinitions,
  nodeDefinitions => {
    console.log('i see nodeDefinitions, update syncers', nodeDefinitions)
    for (const identifier in nodeDefinitions) {
      const definition = nodeDefinitions[identifier]
      const workers = definition.workers || []
      for (const worker of workers) {
        Syncers.push(
          new Syncer({
            id: worker.id,
            name: worker.name,
            appIdentifier: worker.id,
            runner: worker.runner,
            interval: worker.interval,
          }),
        )
      }
    }
  },
)

export const syncers: WorkerOptions[] = []

export const Syncers = []
