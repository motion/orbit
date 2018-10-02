import { JobEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { Subscription } from '@mcro/mediator'
import { observeMany } from '@mcro/model-bridge'
import { Job, Setting, SettingModel } from '@mcro/models'
import { getRepository } from 'typeorm'
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
  name: string
  options: SyncerOptions
  log: Logger

  private intervals: {
    setting?: Setting
    timer: Timer
    running?: Promise<any>
  }[] = []
  private subscription: Subscription

  constructor(options: SyncerOptions) {
    this.options = options
    this.name = options.name || options.constructor.name
    this.log = new Logger('syncer:' + (options.type || this.name))
  }

  /**
   * Starts a process of active syncronization (runs interval).
   */
  async start(force = false) {
    if (this.options.type) {

      // register interval and run syncer
      this.subscription = observeMany(SettingModel, { args: { where: { type: this.options.type } }})
        .subscribe(async settings => {
          this.log.info('got settings in syncer', settings)

          const intervalSettings = this.intervals
            .filter(interval => !!interval.setting)
            .map(interval => interval.setting)

          const settingIds = settings.map(setting => setting.id)
          const intervalSettingIds = intervalSettings.map(setting => setting.id)

          // find new settings (for those we don't have intervals) and run intervals for them
          const newSettings = settings.filter(setting => intervalSettingIds.indexOf(setting.id) === -1)
          if (newSettings.length) {
            this.log.info(`found new settings, creating intervals for them`, newSettings)
            for (let setting of newSettings) {
              await this.runInterval(setting.id, setting.id, force)
            }
          }

          // find removed settings and remove intervals for them if they exist
          const removedSettings = intervalSettings.filter(setting => settingIds.indexOf(setting.id) === -1)
          if (removedSettings.length) {
            this.log.info(`found removed settings, removing their intervals`, removedSettings)
            for (let setting of removedSettings) {
              const interval = this.intervals.find(interval => {
                return interval.setting && interval.setting.id === setting.id
              })
              if (interval) {
                if (interval.running) { // if its running await once it finished
                  await interval.running
                }
                this.intervals.splice(this.intervals.indexOf(interval))
              }
            }
          }

          // update exist in the interval settings to make sure it will have appropriate data in the next syncer run
          for (let interval of this.intervals) {
            if (interval.setting) {
              const updatedSetting = settings.find(setting => setting.id === interval.setting.id)
              if (updatedSetting) {
                Object.assign(interval.setting, updatedSetting)
              }
            }
          }

        /**
         * Subscriber to listen to settings and react.
         * For example, if new setting was inserted with the given type we need to create an interval for it,
         * or if setting was removed we need to remove interval to prevent process

      settingEntitySubscriber: EntitySubscriberInterface<SettingEntity> = {
          beforeRemove: async event => {
            log.info(
              'looks like somebody is going to remove a settings, let\'s check if we have timer for it',
              event,
            )
            const interval = this.intervals.find(
              interval => interval.setting && interval.setting.id === event.entityId,
            )
            if (interval) {
              if (interval.running) {
                log.info(
                  'okay we found timer for removed setting and syncronization is running at the moment, let\'s await it before final setting removal',
                )
                await interval.running
                log.info('interval has finished its job, now we can continue to setting removal')
              } else {
                log.info(
                  'interval was found, but its not currently running syncronization, its safe to proceed to setting removal',
                )
              }
            }
          },
          afterInsert: async event => {
            log.info(`looks like new setting was inserted, check if its ${this.options.type}`, event)
            const setting = await getRepository(SettingEntity).findOne({
              id: event.entity.id,
              type: this.options.type,
            })
            if (setting) {
              // we don't need to await here because we don't want to block setting save when its added
              log.info('okay we have a new setting that we are going to sync')
              this.runInterval(setting.id, setting.id)
            }
          },
          afterRemove: async event => {
            log.info('looks like some setting was removed, check if we have it in timers', event)
            const interval = this.intervals.find(
              interval => interval.setting && interval.setting.id === event.entityId,
            )
            if (interval) {
              log.info('okay we had interval for it, let\'s removing it now', interval)
              this.intervals.splice(this.intervals.indexOf(interval))
            }
          },
        }*/
      })
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

    // remove entity subscription
    if (this.subscription) {
      this.subscription.unsubscribe()
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
          this.log.verbose(
            `found job for ${jobName} but it left uncompleted ` +
              '(probably app was closed before job completion). ' +
              'Removing stale job and run synchronization again',
          )
          await getRepository(JobEntity).remove(lastJob)
        } else {
          if (needToWait > 0) {
            this.log.verbose(
              `found last executed job for ${jobName} and we should wait ` +
                'until enough interval time will pass before we execute a new job',
              { jobTime, currentTime, needToWait, lastJob },
            )
            setTimeout(() => this.runInterval(index, settingId), needToWait)
            return
          }
        }
      } else {
        this.log.verbose(
          `found last executed job for ${this.name} and its okay to execute a new job`,
          lastJob,
        )
      }
    }

    // clear previously run interval if exist
    if (this.intervals[index]) clearInterval(this.intervals[index].timer)

    // load setting and run initial syncer
    const setting = settingId ? await getRepository(SettingEntity).findOne({ id: settingId }) : undefined
    await this.runSyncer(setting)

    // create interval to run syncer periodically
    if (this.options.interval) {
      this.intervals[index] = {
        setting,
        timer: setInterval(async () => {
          // if we still have previous interval running - we don't do anything
          if (this.intervals[index].running) {
            this.log.info(
              `tried to run ${
                this.name
              } based on interval, but synchronization is already running, skipping`,
            )
            return
          }

          const setting = await getRepository(SettingEntity).findOne({ id: settingId })
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
    this.log.info(`starting ${this.options.constructor.name} syncer`)

    // create a new job - the fact that we started a new syncer
    const job: Job = {
      target: 'job',
      syncer: this.name,
      setting: setting,
      time: new Date().getTime(),
      type: 'INTEGRATION_SYNC',
      status: 'PROCESSING',
      message: '',
    }
    await getRepository(JobEntity).save(job)
    this.log.verbose('created a new job', job)

    try {
      const syncer = new this.options.constructor(setting)
      await syncer.run()

      // update our job (finish successfully)
      job.status = 'COMPLETE'
      await getRepository(JobEntity).save(job)
    } catch (error) {
      this.log.error(`${this.options.constructor.name} sync err`, error)

      // update our job (finish with error)
      job.status = 'FAILED'
      try {
        if (typeof error.toString === 'function') {
          job.message = error.toString()
        } else {
          job.message = JSON.stringify(error)
        }
      } catch (err) {
        job.message = ''
      }
      await getRepository(JobEntity).save(job)
    }
    this.log.info(`${this.options.constructor.name} finished`)
  }

}
