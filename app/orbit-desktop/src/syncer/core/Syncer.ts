import {
  EntitySubscriberInterface,
  getConnection,
  getRepository,
} from 'typeorm'
import { JobEntity } from '../../entities/JobEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { SyncerOptions } from './IntegrationSyncer'
import Timer = NodeJS.Timer
import { logger } from '@mcro/logger'
import { Setting } from '@mcro/models'
import { assign } from '../../utils'

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
  name: string
  options: SyncerOptions

  private intervals: {
    setting?: Setting
    timer: Timer
    running?: Promise<any>
  }[] = []

  constructor(options: SyncerOptions) {
    this.options = options
    this.name = options.name || options.constructor.name
  }

  /**
   * Starts a process of active syncronization (runs interval).
   */
  async start(force = false) {
    if (this.options.type) {
      // register subscriber
      const subscribers = getConnection().subscribers
      if (subscribers.indexOf(this.settingEntitySubscriber) === -1) {
        subscribers.push(this.settingEntitySubscriber)
      }

      // register interval and run syncer
      const settings = await SettingEntity.find({ type: this.options.type })
      await Promise.all(
        settings.map(async setting => {
          return this.runInterval(setting.id, setting.id, force)
        }),
      )
    } else {
      await this.runInterval(0, undefined, force)
    }
  }

  /**
   * Stops intervals that run synchronization process.
   */
  async stop() {
    // clear intervals
    for (let interval of this.intervals) {
      if (!interval) {
        console.log('weird no interval', this.intervals)
      } else {
        clearInterval(interval.timer)
      }
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
  private async runInterval(index: number, settingId?: number, force = false) {
    // get the last run job
    if (force === false) {
      const lastJob = await getRepository(JobEntity).findOne({
        where: {
          syncer: this.name,
          settingId: settingId,
        },
        order: {
          time: 'desc',
        },
      })
      if (lastJob) {
        const jobTime = lastJob.time + this.options.interval
        const currentTime = new Date().getTime()
        const needToWait = jobTime - currentTime
        const jobName = this.name + (settingId ? ':' + settingId : '')

        // if app was closed when syncer was in processing
        if (lastJob.status === 'PROCESSING' && !this.intervals[index]) {
          log(
            `found job for ${jobName} but it left uncompleted ` +
            `(probably app was closed before job completion). ` +
            `Removing stale job and run synchronization again`
          )
          await getRepository(JobEntity).remove(lastJob)

        } else {
          if (needToWait > 0) {
            log(
              `found last executed job for ${jobName} and we should wait ` +
              'until enough interval time will pass before we execute a new job',
              { jobTime, currentTime, needToWait, lastJob },
            )
            setTimeout(() => this.runInterval(index, settingId), needToWait)
            return
          }
        }
      } else {
        log(
          `found last executed job for ${
            this.name
            } and its okay to execute a new job`,
          lastJob,
        )
      }
    }

    // clear previously run interval if exist
    if (this.intervals[index]) clearInterval(this.intervals[index].timer)

    // load setting and run initial syncer
    const setting = settingId
      ? await SettingEntity.findOne({ id: settingId })
      : undefined
    await this.runSyncer(setting)

    // create interval to run syncer periodically
    if (this.options.interval) {
      this.intervals[index] = {
        setting,
        timer: setInterval(async () => {
          // if we still have previous interval running - we don't do anything
          if (this.intervals[index].running) {
            log(
              `tried to run ${
                this.name
              } based on interval, but synchronization is already running, skipping`,
            )
            return
          }

          const setting = await SettingEntity.findOne({ id: settingId })
          this.intervals[index].setting = setting
          this.intervals[index].running = this.runSyncer(setting)
          await this.intervals[index].running
          this.intervals[index].running = undefined
        }, this.options.interval),
      }
    }
  }

  /**
   * Runs syncer immediately.
   */
  async runSyncer(setting?: SettingEntity) {
    log(`starting ${this.options.constructor.name} syncer`, setting)

    // create a new job - the fact that we started a new syncer
    const job = assign(new JobEntity(), {
      syncer: this.name,
      setting: setting,
      time: new Date().getTime(),
      status: 'PROCESSING',
      message: '',
    })
    await getRepository(JobEntity).save(job)
    log('created a new job', job)

    try {
      const syncer = new this.options.constructor(setting)
      await syncer.run()

      // update our job (finish successfully)
      job.status = 'COMPLETE'
      await getRepository(JobEntity).save(job)
    } catch (error) {
      log(
        'error',
        `error in ${this.options.constructor.name} syncer sync`,
        error,
      )

      // update our job (finish with error)
      job.status = 'FAILED'
      job.message = JSON.stringify(error)
      await getRepository(JobEntity).save(job)
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
      log(
        'looks like somebody is going to remove a settings, let\'s check if we have timer for it',
        event,
      )
      const interval = this.intervals.find(
        interval => interval.setting && interval.setting.id === event.entityId,
      )
      if (interval) {
        if (interval.running) {
          log(
            'okay we found timer for removed setting and syncronization is running at the moment, let\'s await it before final setting removal',
          )
          await interval.running
          log(
            'interval has finished its job, now we can continue to setting removal',
          )
        } else {
          log(
            'interval was found, but its not currently running syncronization, its safe to proceed to setting removal',
          )
        }
      }
    },
    afterInsert: async event => {
      log(
        `looks like new setting was inserted, check if its ${
          this.options.type
        }`,
        event,
      )
      const setting = await SettingEntity.findOne({
        id: event.entity.id,
        type: this.options.type,
      })
      if (setting) {
        // we don't need to await here because we don't want to block setting save when its added
        log('okay we have a new setting that we are going to sync')
        this.runInterval(setting.id, setting.id)
      }
    },
    afterUpdate: async event => {
      /* todo do what we want on setting update */
    },
    afterRemove: async event => {
      log(
        'looks like some setting was removed, check if we have it in timers',
        event,
      )
      const interval = this.intervals.find(
        interval => interval.setting && interval.setting.id === event.entityId,
      )
      if (interval) {
        log('okay we had interval for it, let\'s removing it now', interval)
        this.intervals.splice(this.intervals.indexOf(interval))
      }
    },
  }
}
