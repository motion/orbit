import { logger } from '@mcro/logger'
import { Syncer } from './Syncer'

/**
 * Groups multiple syncers into a group that must be run in a sequence.
 */
export class SyncerGroup {
  name: string
  syncers: Syncer[]

  constructor(name: string, syncers: Syncer[]) {
    this.name = name
    this.syncers = syncers
  }

  /**
   * Starts a process of active syncronization (runs interval).
   */
  async start() {
    for (let syncer of this.syncers) {
      await syncer.start()
    }
  }

  /**
   * Stops a process of syncronization.
   */
  async stop() {
    for (let syncer of this.syncers) {
      await syncer.stop()
    }
  }

}
