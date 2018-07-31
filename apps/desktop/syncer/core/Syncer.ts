import { Setting } from '@mcro/models'
import { SyncerOptions } from './IntegrationSyncer'
import Timer = NodeJS.Timer

/**
 * Runs given integration syncer.
 * Sync is interval-based, it sync data each x period of times.
 *
 * Some of the syncer requirements:
 *
 *   1. we need to sync whens setting changes
 *   2. we need to sync periodically (each hour lets say)
 *   3. record errors and progress
 *   4. don’t sync again if sync already running (lock)
 *   5. manually trigger a sync from fronted
 *   6. run syncer from the REPL
 */
export class Syncer {

  options: SyncerOptions
  private intervalIds: Timer[] = []

  constructor(options: SyncerOptions) {
    this.options = options
  }

  /**
   * Starts a process of active syncronization (runs interval).
   */
  async start() {
    const settings = await Setting.find({ type: this.options.type })
    await Promise.all(settings.map(async setting => {

      if (this.intervalIds[setting.id])
        clearInterval(this.intervalIds[setting.id])

      this.intervalIds[setting.id] = setInterval(
        () => this.runSyncer(setting),
        1000 * 60 // 1 minute
      )

      await this.runSyncer(setting)
    }))
  }

  /**
   * Stops a process of syncronization.
   */
  async stop() {
    this.intervalIds.forEach(intervalId => {
      clearInterval(intervalId)
    })
  }

  /**
   * Runs syncer immediately.
   */
  async runSyncer(setting: Setting) {
    const syncer = new this.options.constructor(setting);
    return syncer.run(); // todo: add try/catch block here
  }

}