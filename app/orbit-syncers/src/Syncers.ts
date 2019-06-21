import { OrbitAppsManager } from '@o/libs-node'
import { reaction } from 'mobx'

const orbitAppsManager = new OrbitAppsManager()

reaction(
  () => orbitAppsManager.nodeAppDefinitions,
  nodeDefinitions => {
    console.log('i see nodeDefinitions, update workers', nodeDefinitions)
    for (const identifier in nodeDefinitions) {
      const definition = nodeDefinitions[identifier]
      const workers = definition.workers || []
      for (const worker of workers) {
        // TODO make this work
        console.log('i see worker', worker)
      }
    }
  },
)

export const workers: WorkerOptions[] = []
