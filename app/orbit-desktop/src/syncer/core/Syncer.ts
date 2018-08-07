import { SettingEntity } from '../../entities/SettingEntity'
import { SyncerOptions } from './IntegrationSyncer'
import Timer = NodeJS.Timer
import { logger } from '@mcro/logger'

const log = logger('syncer')

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
    const settings = await SettingEntity.find({ type: this.options.type })
    await Promise.all(
      settings.map(async setting => {
        if (this.intervalIds[setting.id])
          clearInterval(this.intervalIds[setting.id])

        this.intervalIds[setting.id] = setInterval(
          () => this.runSyncer(setting),
          1000 * 60, // 1 minute
        )

        await this.runSyncer(setting)
      }),
    )
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
   * Resets all the data bring by a syncer.
   * Can be used to make syncronization from scratch.
   */
  async reset() {
    const settings = await SettingEntity.find({ type: this.options.type })
    await Promise.all(settings.map(async setting => {
      return this.resetSyncer(setting)
    }))
  }

  /**
   * Runs syncer immediately.
   */
  private async runSyncer(setting: SettingEntity) {
    log(`starting ${this.options.constructor.name} syncer based on setting`, setting)
    try {
      const syncer = new this.options.constructor(setting)
      await syncer.run()

    } catch(error) {
      log(`error`, `error in ${this.options.constructor.name} syncer sync`, error)
    }
    log(`${this.options.constructor.name} syncer has finished its job`)
  }

  /**
   * Resets syncer data.
   */
  private async resetSyncer(setting: SettingEntity) {
    log(`resetting ${this.options.constructor.name} syncer`, setting)
    try {
      const syncer = new this.options.constructor(setting)
      await syncer.reset()

    } catch(error) {
      log(`error`, `error in ${this.options.constructor.name} syncer reset based on setting`, error)
    }
    log(`${this.options.constructor.name} syncer has finished its job`)
  }

}
