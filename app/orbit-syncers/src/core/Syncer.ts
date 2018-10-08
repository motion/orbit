import { JobEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { Subscription } from '@mcro/mediator'
import { observeMany } from '@mcro/model-bridge'
import { Job, Setting, SettingModel } from '@mcro/models'
import { getRepository } from 'typeorm'
import { SyncerOptions } from './IntegrationSyncer'
import Timer = NodeJS.Timer

/**
 * Interval running in the Syncer.
 */
interface SyncerInterval {
  setting?: Setting
  timer: Timer
  running?: Promise<any>
}

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
 *   5. manually trigger a sync from clients
 *   6. run syncer from the REPL
 */
export class Syncer {
  name: string
  options: SyncerOptions

  private log: Logger
  private intervals: SyncerInterval[] = []
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

      // in force mode we simply load all settings and run them, we don't need to create a subscription
      if (force) {
        const settings = await getRepository(SettingEntity).find()
        for (let setting of settings) {
          await this.runInterval(setting, true)
        }

      } else {
        this.subscription = observeMany(SettingModel, { args: { where: { type: this.options.type } }})
          .subscribe(async settings => this.reactOnSettingsChanges(settings))
      }
    } else {
      await this.runInterval(undefined, force)
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

    // remove entity subscription
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  /**
   * Reacts on setting changes - manages settings lifecycle and how syncer deals with it.
   */
  private async reactOnSettingsChanges(settings: Setting[]) {
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
        await this.runInterval(setting)
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
          clearInterval(interval.timer)
          this.intervals.splice(this.intervals.indexOf(interval), 1)
        }
      }
      this.log.info(`intervals were removed`, this.intervals)
    }

  }

  /**
   * Runs interval to run a syncer.
   */
  private async runInterval(setting: Setting, force = false) {

    let interval: SyncerInterval|undefined
    if (setting) {
      interval = this.intervals.find(interval => interval.setting.id === setting.id)
    }
    const log = new Logger(
      'syncer:' +
      (setting ? setting.type + ":" + setting.id : '') +
      (force ? 'force' : '')
    )

    // get the last run job
    if (force === false) {
      const lastJob = await getRepository(JobEntity).findOne({
        where: {
          type: 'INTEGRATION_SYNC',
          syncer: this.name,
          settingId: setting.id,
        },
        order: {
          time: 'desc',
        },
      })
      if (lastJob) {
        const jobTime = lastJob.time + this.options.interval
        const currentTime = new Date().getTime()
        const needToWait = jobTime - currentTime
        const jobName = this.name + (setting.id ? ':' + setting.id : '')

        // if app was closed when syncer was in processing
        if (lastJob.status === 'PROCESSING' && !interval) {
          log.info(
            `found job for ${jobName} but it left uncompleted ` +
            '(probably app was closed before job completion). ' +
            'Removing stale job and run synchronization again',
          )
          await getRepository(JobEntity).remove(lastJob)
        } else {
          if (needToWait > 0) {
            log.info(
              `found last executed job for ${jobName} and we should wait ` +
                'until enough interval time will pass before we execute a new job',
              { jobTime, currentTime, needToWait, lastJob },
            )
            setTimeout(() => this.runInterval(setting), needToWait)
            return
          }
          log.info(
            `found last executed job for ${this.name} and its okay to execute a new job`,
            lastJob,
          )
        }
      }
    }

    // clear previously run interval if exist
    if (interval) {
      log.info(`clearing previous interval`, interval)
      if (interval.running) // if its running await it
        await interval.running

      clearInterval(interval.timer)
      this.intervals.splice(this.intervals.indexOf(interval), 1)
    }

    // run syncer
    const syncerPromise = this.runSyncer(log, setting) // note: don't await it

    // create interval to run syncer periodically
    if (this.options.interval) {
      interval = {
        setting,
        running: syncerPromise,
        timer: setInterval(async () => {
          // if we still have previous interval running - we don't do anything
          if (interval.running) {
            log.info(`tried to run ${this.name} based on interval, but synchronization is already running, skipping`)
            return
          }

          // re-load setting again just to make sure we have a new version of it
          const latestSetting = await getRepository(SettingEntity).findOne({ id: setting.id })
          interval.setting = latestSetting
          interval.running = this.runSyncer(log, latestSetting)
          await interval.running
          interval.running = undefined
        }, this.options.interval),
      }
      this.intervals.push(interval)
    }
  }

  /**
   * Runs syncer immediately.
   */
  async runSyncer(log: Logger, setting?: Setting) {
    log.info(`starting ${this.options.constructor.name} syncer`)

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
    log.info('created a new job', job)

    try {
      log.clean() // clean syncer timers, do a fresh logger start
      const syncer = new this.options.constructor(setting, log)
      await syncer.run()

      // update our job (finish successfully)
      job.status = 'COMPLETE'
      await getRepository(JobEntity).save(job)
      log.info(`job updated`, job)

    } catch (error) {
      log.error(`${this.options.constructor.name} sync err`, error)

      // update our job (finish with error)
      job.status = 'FAILED'
      try {
        if (typeof error.toString === 'function') {
          job.message = error.toString()
        } else {
          job.message = JSON.stringify(error)
        }
      } catch (error) {
        job.message = ''
      }
      log.info(`updating job`, job)
      await getRepository(JobEntity).save(job)
    }
    log.info(`${this.options.constructor.name} finished`)
  }

}
