// @flow
import { store, watch, react } from '@mcro/black'
import * as Syncers from './syncers'
import { Job, Setting } from '@mcro/models'

const log = debug('sync')

function getRxError(error: Error) {
  const { message, stack } = error
  try {
    const parsedMessage = JSON.parse(message)
    console.log(JSON.stringify(parsedMessage, null, 2))
  } catch (e) {
    console.trace(message)
  }
  return { message, stack }
}

@store
export default class Sync {
  locks: Set<string> = new Set()
  jobs = []
  syncers: ?Object = null
  enabled = true

  start() {
    this.startSyncers()

    Job.on(jobs => {
      console.log('got jobs', jobs)
    })
  }

  @watch
  syncLog = () => {
    const title = this.enabled
      ? 'SYNC ENABLED ✅ (disable: App.sync.disable())'
      : 'SYNC DISABLED (enable: App.sync.enable())'
    log(`%c----${title}----`)
  }

  @react
  processJobs = [
    () => this.jobs,
    async jobs => {
      log('startJobs jobs:', jobs ? jobs.length : 0)
      if (!this.enabled) {
        return
      }
      if (!jobs || !jobs.length) {
        return
      }
      for (const job of jobs) {
        if (!job) {
          return
        }
        if (this.locks.has(job.lock)) {
          log('Already locked job:', job.lock)
          return
        }
        let completed = false

        // expire stale jobs
        setTimeout(async () => {
          if (!completed) {
            await this.failJob(job, { message: 'timed out---' })
            this.locks.delete(job.lock)
            log('removed stale job', job.lock)
          }
        }, 1000 * 60 * 2) // 2 min

        this.locks.add(job.lock)
        try {
          log('Run job', job.type, job.action)
          await this.runJob(job)
          completed = true
        } catch (error) {
          let lastError = error
          try {
            lastError = getRxError(error)
          } catch (err) {}
          this.failJob(job, lastError)
        }
        this.locks.delete(job.lock)
      }
    },
  ]

  runAll() {
    for (const name of Object.keys(this.syncers)) {
      this.syncers[name].runAll()
    }
  }

  run(integration?: string, action?: string) {
    if (!integration) {
      console.log('Needs parameters')
    } else {
      this.syncers[integration][action ? 'run' : 'runAll'](action)
    }
  }

  enable() {
    this.enabled = true
    this.runAll()
  }

  disable() {
    this.enabled = false
  }

  async dispose() {
    await this.disposeSyncers()
  }

  async disposeSyncers() {
    if (!this.syncers) {
      return
    }
    for (const name of Object.keys(this.syncers)) {
      if (this.syncers[name].dispose) {
        await this.syncers[name].dispose()
      }
    }
    this.syncers = null
  }

  async startSyncers() {
    if (!this.syncers) {
      this.syncers = {}
      console.log('Syncers', Syncers)
      for (const name of Object.keys(Syncers)) {
        try {
          const syncer = Syncers[name]
          const setting = await Setting.get({ type: syncer.settings.type })
          if (syncer.start) {
            await syncer.start({ setting })
          }
          this.syncers[name] = syncer
          if (!this[name]) {
            // $FlowIgnore
            this[name] = syncer
          }
        } catch (err) {
          console.log('error starting syncer', name)
          console.log(err)
        }
      }
    }
  }

  failJob = async (job: Job, lastError) => {
    try {
      await job.update({
        status: 3,
        lastError,
        tries: job.tries + 1,
      })
    } catch (err) {
      if (err.message && err.message.indexOf('cant save deleted document')) {
        return
      }
      console.log(err)
    }
  }

  runJob = async (job: Job) => {
    log('Running job', job.type, job.action)
    await job.update({
      percent: 0,
      status: Job.status.PROCESSING,
      tries: job.tries + 1,
    })

    if (!this.syncers) {
      return
    }
    const syncer = this.syncers[job.type]

    if (syncer) {
      try {
        await syncer.run(job.action)
      } catch (error) {
        console.log('error running syncer', error)
        await job.update({
          status: Job.status.FAILED,
          lastError: getRxError(error),
        })
      }
    } else {
      console.log('no syncer found for', job)
    }

    // update job
    await job.update({ percent: 100, status: Job.status.COMPLETED })
    log('Job completed:', job.type, job.action, job.id)
  }
}
