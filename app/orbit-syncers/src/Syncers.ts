import { OrbitAppsManager } from '@o/libs-node'
import { reaction } from 'mobx'

const orbitAppsManager = new OrbitAppsManager()

const workers: WorkerOptions[] = []

export function getWorkers() {
  return workers
}

// TODO finish

reaction(
  () => orbitAppsManager.nodeAppDefinitions,
  nodeDefinitions => {
    console.log('i see nodeDefinitions, update workers', nodeDefinitions)
    for (const identifier in nodeDefinitions) {
      const definition = nodeDefinitions[identifier]
      const next = definition.workers || []
      for (const worker of next) {
        // TODO make this work
        console.log('i see worker', worker)
      }
    }
  },
)
