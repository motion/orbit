import { OrbitAppsManager } from '@o/libs-node'
import { decorate, react } from '@o/use-store'
import { Logger } from '@o/logger'

const log = new Logger('WorkersManager')

// in the future we could potentially actually run these in a process
// and then we'd have info here like process, etc
// for now, this is just a placeholder
type WorkerInfo = {
  name: string
}

@decorate
export class WorkersManager {
  workers = new Map<string, WorkerInfo>()
  orbitAppsManager = new OrbitAppsManager()

  async start() {
    await this.orbitAppsManager.start()
  }

  async stop() {
    // todo stop
  }

  updateAppDefinitions = react(
    () => this.orbitAppsManager.nodeAppDefinitions,
    async nodeDefinitions => {
      log.info('i see nodeDefinitions, update workers', Object.keys(nodeDefinitions))

      for (const identifier in nodeDefinitions) {
        // In development mode we could restart all workers whenever we see one update
        // that wouldn't be too disruptive.
        // for now, just do the same thing as prod (if already running, ignore)
        if (this.workers.has(identifier)) {
          continue
        }

        const workers = nodeDefinitions[identifier].workers || []
        for (const worker of workers) {
          console.log('i see worker', worker)
          try {
            worker()
          } catch (err) {
            log.error(`Error running worker ${err.message}`, err)
          }
        }
      }
    },
  )
}
