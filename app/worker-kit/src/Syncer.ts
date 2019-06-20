import { Logger } from '@o/logger'
import { Subscription } from '@o/mediator'
import { AppBit, AppEntity, AppModel, Job, JobEntity } from '@o/models'
import { WorkerOptions, WorkerUtils } from '@o/worker-kit'
import { getManager, getRepository } from 'typeorm'

// import { syncersRoot } from './OrbitSyncersRoot'
import { mediatorClient } from './mediatorClient'

const cancelCommands = new Set()

export class AppCancelError extends Error {}

export function cancelSyncer(appId: number) {
  cancelCommands.add(appId)
}

function checkCancelled(appId: number) {
  if (cancelCommands.has(appId)) {
    cancelCommands.delete(appId)
    throw new AppCancelError(`Cancelled: ${appId}`)
  }
  return true
}

/**
 * Interval running in the Syncer.
 */
interface SyncerInterval {
  app?: AppEntity
  timer: any // nodejs timer
  running?: Promise<any>
}

/**
 * Runs given app syncer.
 * Sync is interval-based, it sync data each x period of times.
 *
 * Some of the syncer requirements:
 *
 *   1. we need to sync whens app changes
 *   2. we need to sync periodically (each hour lets say)
 *   3. record errors and progress
 *   4. don’t sync again if sync already running (lock)
 *   5. manually trigger a sync from clients
 *   6. run syncer from the REPL
 */
export class Syncer {
  name: string
  options: WorkerOptions

  private log: Logger
  private intervals: SyncerInterval[] = []
  private subscription: Subscription

  constructor(options: WorkerOptions) {
    this.options = options
    this.name = options.name
    this.log = new Logger('syncer:' + (options.appIdentifier || this.name))
  }

  /**
   * Starts a process of active syncronization (runs interval).
   */
  async start(force = false) {
    if (this.options.appIdentifier) {
      // in force mode we simply load all apps and run them, we don't need to create a subscription
      if (force) {
        const apps = await getRepository(AppEntity).find({ identifier: this.options.appIdentifier })
        for (let app of apps) {
          await this.runInterval(app as AppBit, true)
        }
      } else {
        this.subscription = syncersRoot.mediatorClient
          .observeMany(AppModel, {
            args: { where: { identifier: this.options.appIdentifier } },
          })
          .subscribe(async apps => this.reactOnSettingsChanges(apps))
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
   * Reacts on app changes - manages apps lifecycle and how syncer deals with it.
   */
  private async reactOnSettingsChanges(apps: AppBit[]) {
    this.log.info('got apps in syncer', apps)

    const intervalSettings = this.intervals
      .filter(interval => !!interval.app)
      .map(interval => interval.app)

    const appIds = apps.map(app => app.id)
    const intervalSettingIds = intervalSettings.map(app => app.id)

    // find new apps (for those we don't have intervals) and run intervals for them
    const newSettings = apps.filter(app => intervalSettingIds.indexOf(app.id) === -1)
    if (newSettings.length) {
      this.log.info('found new apps, creating intervals for them', newSettings)
      for (let app of newSettings) {
        await this.runInterval(app)
      }
    }

    // find removed apps and remove intervals for them if they exist
    const removedSettings = intervalSettings.filter(app => appIds.indexOf(app.id) === -1)
    if (removedSettings.length) {
      this.log.info('found removed apps, removing their intervals', removedSettings)
      for (let app of removedSettings) {
        const interval = this.intervals.find(interval => {
          return interval.app && interval.app.id === app.id
        })
        if (interval) {
          // commented because we can't await it since app is already missing inside at this moment
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
  private async runInterval(app: AppBit, force = false) {
    let interval: SyncerInterval | undefined
    if (app) {
      interval = this.intervals.find(interval => interval.app.id === app.id)
    }
    const log = new Logger(
      'syncer:' + (app ? app.identifier + ':' + app.id : '') + (force ? ' (force)' : ''),
    )

    // get the last run job
    if (force === false) {
      const lastJob = await getRepository(JobEntity).findOne({
        where: {
          type: 'APP_SYNC',
          syncer: this.name,
          appId: app ? app.id : undefined,
        },
        order: {
          time: 'desc',
        },
      })
      if (lastJob) {
        const jobTime = lastJob.time + this.options.interval
        const currentTime = new Date().getTime()
        const needToWait = jobTime - currentTime
        const jobName = this.name + (app ? ':' + app.id : '')

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
            setTimeout(() => this.runInterval(app), needToWait)
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
    const syncerPromise = this.runSyncer(log, app) // note: don't await it

    // create interval to run syncer periodically
    if (this.options.interval && force === false) {
      interval = {
        app: app as AppEntity,
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

          // re-load app again just to make sure we have a new version of it
          const latestApp = app ? await getRepository(AppEntity).findOne({ id: app.id }) : undefined
          interval.app = latestApp
          interval.running = this.runSyncer(log, latestApp as AppBit)
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
  async runSyncer(log: Logger, app?: AppBit) {
    // create a new job - the fact that we started a new syncer
    const job: Job = {
      target: 'job',
      syncer: this.name,
      app,
      time: new Date().getTime(),
      type: 'APP_SYNC',
      status: 'PROCESSING',
      message: '',
    }
    await getRepository(JobEntity).save(job)
    log.info('created a new job', job)

    try {
      log.clean() // clean syncer timers, do a fresh logger start
      log.timer(`${this.options.name} sync`)

      await this.options.runner({
        app,
        log,
        manager: getManager(),
        isAborted: async () => checkCancelled(app.id) && void 0,
        utils: new WorkerUtils(
          app,
          log,
          getManager(),
          mediatorClient,
          async () => !!checkCancelled(app.id),
        ),
      })

      // update our job (finish successfully)
      job.status = 'COMPLETE'
      await getRepository(JobEntity).save(job)
      log.info('job updated', job)
      log.timer(`${this.options.name} sync`)
    } catch (error) {
      log.error(`${this.options.name} sync err`, error)
      log.timer(`${this.options.name} sync`)

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
