import { OrbitAppsManager } from '@o/libs-node'
import { decorate, react } from '@o/use-store'

@decorate
export class WorkersManager {
  workers: WorkerOptions[] = []
  orbitAppsManager = new OrbitAppsManager()

  updateAppDefinitions = react(
    () => this.orbitAppsManager.nodeAppDefinitions,
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
}
