import { AppsManager } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { decorate, react } from '@o/use-store'

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
  appsManager = new AppsManager()

  async start() {
    await this.appsManager.start()
  }

  async stop() {
    // todo stop
  }

  runUpdateAppDefinitions = react(
    () => this.appsManager.nodeAppDefinitions,
    this.updateAppDefinitions,
  )

  async updateAppDefinitions() {
    const { nodeAppDefinitions } = this.appsManager
    log.info('i see nodeDefinitions, update workers', nodeAppDefinitions)

    for (const definition of nodeAppDefinitions) {
      // In development mode we could restart all workers whenever we see one update
      // that wouldn't be too disruptive.
      // for now, just do the same thing as prod (if already running, ignore)
      if (this.workers.has(definition.id)) {
        continue
      }

      const workers = definition.workers || []
      for (const worker of workers) {
        log.verbose('running worker', worker)
        try {
          worker()
        } catch (err) {
          log.error(`Error running worker ${err.message}`, err)
        }
      }
    }
  }
}
