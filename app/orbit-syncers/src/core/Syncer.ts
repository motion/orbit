import { JobEntity, SourceEntity } from '@mcro/models'
import { Logger } from '@mcro/logger'
import { Subscription } from '@mcro/mediator'
import { observeMany } from '@mcro/model-bridge'
import { Job, Source, SourceModel } from '@mcro/models'
import { getRepository } from 'typeorm'
import { SyncerOptions } from './IntegrationSyncer'
import Timer = NodeJS.Timer

/**
 * Interval running in the Syncer.
 */
interface SyncerInterval {
  source?: Source
  timer: Timer
  running?: Promise<any>
}

/**
 * Runs given integration syncer.
 * Sync is interval-based, it sync data each x period of times.
 *
 * Some of the syncer requirements:
 *
 *   1. we need to sync whens source changes
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
      // in force mode we simply load all sources and run them, we don't need to create a subscription
      if (force) {
        const sources = await getRepository(SourceEntity).find({ type: this.options.type })
        for (let source of sources) {
          await this.runInterval(source, true)
        }
      } else {
        this.subscription = observeMany(SourceModel, {
          // @ts-ignore
          args: { where: { type: this.options.type } },
        }).subscribe(async sources => this.reactOnSettingsChanges(sources))
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
   * Reacts on source changes - manages sources lifecycle and how syncer deals with it.
   */
  private async reactOnSettingsChanges(sources: Source[]) {
    this.log.info('got sources in syncer', sources)

    const intervalSettings = this.intervals
      .filter(interval => !!interval.source)
      .map(interval => interval.source)

    const sourceIds = sources.map(source => source.id)
    const intervalSettingIds = intervalSettings.map(source => source.id)

    // find new sources (for those we don't have intervals) and run intervals for them
    const newSettings = sources.filter(source => intervalSettingIds.indexOf(source.id) === -1)
    if (newSettings.length) {
      this.log.info('found new sources, creating intervals for them', newSettings)
      for (let source of newSettings) {
        await this.runInterval(source)
      }
    }

    // find removed sources and remove intervals for them if they exist
    const removedSettings = intervalSettings.filter(source => sourceIds.indexOf(source.id) === -1)
    if (removedSettings.length) {
      this.log.info('found removed sources, removing their intervals', removedSettings)
      for (let source of removedSettings) {
        const interval = this.intervals.find(interval => {
          return interval.source && interval.source.id === source.id
        })
        if (interval) {
          // commented because we can't await it since source is already missing inside at this moment
          // if (interval.running) { // if its running await once it finished
          //   await interval.running
          // }
          clearInterval(interval.timer)
          this.intervals.splice(this.intervals.indexOf(interval), 1)
        }
      }
      this.log.info('intervals were removed', this.intervals)
    }
  }

  /**
   * Runs interval to run a syncer.
   */
  private async runInterval(source: Source, force = false) {
    let interval: SyncerInterval | undefined
    if (source) {
      interval = this.intervals.find(interval => interval.source.id === source.id)
    }
    const log = new Logger(
      'syncer:' + (source ? source.type + ':' + source.id : '') + (force ? ' (force)' : ''),
    )

    // get the last run job
    if (force === false) {
      const lastJob = await getRepository(JobEntity).findOne({
        where: {
          type: 'INTEGRATION_SYNC',
          syncer: this.name,
          sourceId: source ? source.id : undefined,
        },
        order: {
          time: 'desc',
        },
      })
      if (lastJob) {
        const jobTime = lastJob.time + this.options.interval
        const currentTime = new Date().getTime()
        const needToWait = jobTime - currentTime
        const jobName = this.name + (source ? ':' + source.id : '')

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
            setTimeout(() => this.runInterval(source), needToWait)
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
      log.info('clearing previous interval', interval)
      if (interval.running)
        // if its running await it
        await interval.running

      clearInterval(interval.timer)
      this.intervals.splice(this.intervals.indexOf(interval), 1)
    }

    // run syncer
    const syncerPromise = this.runSyncer(log, source) // note: don't await it

    // create interval to run syncer periodically
    if (this.options.interval && force === false) {
      interval = {
        source,
        running: syncerPromise,
        timer: setInterval(async () => {
          // if we still have previous interval running - we don't do anything
          if (interval.running) {
            log.info(
              `tried to run ${
                this.name
              } based on interval, but synchronization is already running, skipping`,
            )
            return
          }

          // re-load source again just to make sure we have a new version of it
          const latestSource = source
            ? await getRepository(SourceEntity).findOne({ id: source.id })
            : undefined
          interval.source = latestSource
          interval.running = this.runSyncer(log, latestSource)
          await interval.running
          interval.running = undefined
        }, this.options.interval),
      }
      this.intervals.push(interval)

      // its important to finish initially created interval and clean it
      await interval.running
      interval.running = undefined
    }
  }

  /**
   * Runs syncer immediately.
   */
  async runSyncer(log: Logger, source?: Source) {
    // create a new job - the fact that we started a new syncer
    const job: Job = {
      target: 'job',
      syncer: this.name,
      source,
      time: new Date().getTime(),
      type: 'INTEGRATION_SYNC',
      status: 'PROCESSING',
      message: '',
    }
    await getRepository(JobEntity).save(job)
    log.info('created a new job', job)

    try {
      log.clean() // clean syncer timers, do a fresh logger start
      log.timer(`${this.options.constructor.name} sync`)
      const syncer = new this.options.constructor(source, log)
      await syncer.run()

      // update our job (finish successfully)
      job.status = 'COMPLETE'
      await getRepository(JobEntity).save(job)
      log.info('job updated', job)
      log.timer(`${this.options.constructor.name} sync`)
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
      log.info('updating job', job)
      await getRepository(JobEntity).save(job)
    }
  }
}
