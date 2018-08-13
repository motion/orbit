import { EntitySubscriberInterface, getConnection } from 'typeorm'
import { SettingEntity } from '../../entities/SettingEntity'
import { SyncerOptions } from './IntegrationSyncer'
import Timer = NodeJS.Timer
import { logger } from '@mcro/logger'
import { Setting } from '@mcro/models'

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
  private intervals: {
    setting?: Setting,
    timer: Timer
    running?: Promise<any>
  }[] = []

  constructor(options: SyncerOptions) {
    this.options = options
  }

  /**
   * Starts a process of active syncronization (runs interval).
   */
  async start() {
    if (this.options.type) {

      // register subscriber
      const subscribers = getConnection().subscribers
      if (subscribers.indexOf(this.settingEntitySubscriber) === -1) {
        subscribers.push(this.settingEntitySubscriber)
      }

      // register interval and run syncer
      const settings = await SettingEntity.find({ type: this.options.type })
      await Promise.all(settings.map(async setting => {
        return this.runInterval(setting.id, setting.id)
      }))

    } else {
      await this.runInterval(0)
    }
  }

  /**
   * Stops intervals that run synchronization process.
   */
  async stop() {

    // clear intervals
    for (let interval of this.intervals) {
      clearInterval(interval.timer)
    }
    this.intervals = []

    // remove entity subscriber
    const subscribers = getConnection().subscribers
    if (subscribers.indexOf(this.settingEntitySubscriber) !== -1) {
      subscribers.splice(subscribers.indexOf(this.settingEntitySubscriber), 1)
    }
  }

  /**
   * Runs interval to run a syncer.
   */
  private async runInterval(index: number, settingId?: number) {

    // clear previously run interval if exist
    if (this.intervals[index])
      clearInterval(this.intervals[index].timer)

    // load setting and run initial syncer
    const setting = settingId ? await SettingEntity.findOne({ id: settingId }) : undefined
    await this.runSyncer(setting)

    // create interval to run syncer periodically
    if (this.options.interval) {
      this.intervals[index] = {
        setting,
        timer: setInterval(
          async () => {
            const setting = await SettingEntity.findOne({ id: settingId })
            this.intervals[index].setting = setting
            this.intervals[index].running = this.runSyncer(setting)
            await this.intervals[index].running
            this.intervals[index].running = undefined
          },
          this.options.interval
        )
      }
    }
  }

  /**
   * Runs syncer immediately.
   */
  private async runSyncer(setting?: SettingEntity) {

    log(`starting ${this.options.constructor.name} syncer`, setting)
    try {
      const syncer = new this.options.constructor(setting)
      await syncer.run()

    } catch(error) {
      log(`error`, `error in ${this.options.constructor.name} syncer sync`, error)
    }
    log(`${this.options.constructor.name} syncer has finished its job`)
  }

  /**
   * Subscriber to listen to settings and react.
   * For example, if new setting was inserted with the given type we need to create an interval for it,
   * or if setting was removed we need to remove interval to prevent process
   */
  private settingEntitySubscriber: EntitySubscriberInterface<SettingEntity> = {
    listenTo() {
      return SettingEntity
    },
    beforeRemove: async event => {
      log(`looks like somebody is going to remove a settings, let's check if we have timer for it`, event)
      const interval = this.intervals.find(interval => interval.setting.id === event.entityId)
      if (interval) {
        if (interval.running) {
          log(`okay we found timer for removed setting and syncronization is running at the moment, let's await it before final setting removal`)
          await interval.running
          log(`interval has finished its job, now we can continue to setting removal`)
        } else {
          log(`interval was found, but its not currently running syncronization, its safe to proceed to setting removal`)
        }
      }

    },
    afterInsert: async event => {
      log(`looks like new setting was inserted, check if its ${this.options.type}`, event)
      const setting = await SettingEntity.findOne({
        id: event.entity.id,
        type: this.options.type,
      })
      if (setting) {
        log(`okay we have a new setting that we are going to sync`)
        await this.runInterval(setting.id, setting.id)
      }
    },
    afterUpdate: async event => { /* todo do what we want on setting update */ },
    afterRemove: async event => {
      log(`looks like some setting was removed, check if we have it in timers`, event)
      const interval = this.intervals.find(interval => interval.setting.id === event.entityId)
      if (interval) {
        log(`okay we had interval for it, let's removing it now`, interval)
        this.intervals.splice(this.intervals.indexOf(interval))
      }
    }
  }

}
