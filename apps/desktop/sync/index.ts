import { store, react } from '@mcro/black'
import * as Syncers from './syncers'
import { Job, remove } from '@mcro/models'
import debug from '@mcro/debug'

const log = debug('sync')

// @ts-ignore
@store
export class Sync {
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
      .orWhere('status = :status', { status: Job.statuses.PROCESSING })
      .execute()
    setInterval(async () => {
      const jobs = await Job.find({ status: Job.statuses.PENDING })
      this.jobs = jobs
    }, 2000)
  }

  // save in 3.2.s

  syncLog = react(() => {
    const title = this.enabled
      ? 'SYNC ENABLED ✅ (Root.sync.disable())'
      : 'SYNC DISABLED (Root.sync.enable())'
    console.log(`----${title}----`)
  })

  processJobs = react(
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
        // dont await, run by type in parallel
        this.completeJob(job)
      }
    },
  )

  completeJob = async (job: Job) => {
    this.locks.add(job.lock)
    // clear old processing jobs
    let complete = false
    setTimeout(async () => {
      if (!complete) {
        await this.failJob(job, { message: 'timed out---' })
        this.locks.delete(job.lock)
        log('job timed out, removing...', job.lock)
      }
    }, 1000 * 60 * 20) // 20 min to fail
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

  runAll() {
    for (const name of Object.keys(this.syncers)) {
      this.syncers[name].runAll()
    }
  }

  run(name?: string, action?: string) {
    if (!name) {
      console.log('Needs parameters')
    } else {
      this.syncers[name][action ? 'run' : 'runAll'](action)
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
