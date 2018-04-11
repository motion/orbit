import { store, watch, react } from '@mcro/black'
import * as Syncers from './syncers'
import { Job, Setting, remove } from '@mcro/models'
import debug from '@mcro/debug'

const log = debug('sync')
// debug.quiet('sync')

@store
export default class Sync {
  locks: Set<string> = new Set()
  jobs = []
  syncers?: Object = null
  enabled = false

  async start() {
    this.enabled = true
    this.startSyncers()
    await remove(Job)
      .where('status = :status', { status: Job.statuses.FAILED })
      .orWhere('status = :status', { status: Job.statuses.COMPLETE })
      .execute()
    setInterval(async () => {
      const jobs = await Job.find({ status: Job.statuses.PENDING })
      this.jobs = jobs
    }, 2000)
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
          return
        }
        let complete = false

        // expire stale jobs
        setTimeout(async () => {
          if (!complete) {
            await this.failJob(job, { message: 'timed out---' })
            this.locks.delete(job.lock)
            log('removed stale job', job.lock)
          }
        }, 1000 * 60 * 15) // 15 min

        this.locks.add(job.lock)
        try {
          await this.runJob(job)
          complete = true
        } catch (error) {
          let lastError = error
          try {
            lastError = error.message
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
    if (this.syncers) {
      return
    }
    this.syncers = {}
    for (const name of Object.keys(Syncers)) {
      try {
        if (this[name]) {
          throw `Already defined prop ${name}`
        }
        const syncer = Syncers[name]
        this.syncers[name] = syncer
        this[name] = syncer
        syncer.start()
      } catch (err) {
        console.log('error starting syncer', name, err)
      }
    }
  }

  failJob = async (job: Job, lastError) => {
    try {
      job.status = Job.statuses.FAILED
      job.lastError = lastError
      job.tries += 1
      await job.save()
    } catch (err) {
      if (err.message && err.message.indexOf('cant save deleted document')) {
        return
      }
      console.log('job failed', err)
    }
  }

  runJob = async (job: Job) => {
    job.status = Job.statuses.PROCESSING
    job.tries += 1
    await job.save()
    const syncer = this.syncers[job.type]
    if (!syncer) {
      console.log('no syncer found for', job)
      return
    }
    try {
      await syncer.run(job.action)
      // update job
      job.percent = 100
      job.status = Job.statuses.COMPLETE
      await job.save()
    } catch (error) {
      console.log('error running syncer', error.message || error, error.stack)
      job.status = Job.statuses.FAILED
      job.lastError = JSON.stringify(error)
      await job.save()
    }
  }
}
