// @flow
import { store, watch, react } from '@mcro/black'
import * as Syncers from './syncers'
import { Job, Setting } from '@mcro/models'

const log = debug('sync')

async function findOrCreateSetting({ type }) {
  let setting = await Setting.findOne({ type })
  if (setting) {
    return setting
  }
  setting = new Setting()
  setting.type = type
  return await setting.save()
}

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
        let complete = false

        // expire stale jobs
        setTimeout(async () => {
          if (!complete) {
            await this.failJob(job, { message: 'timed out---' })
            this.locks.delete(job.lock)
            log('removed stale job', job.lock)
          }
        }, 1000 * 60 * 2) // 2 min

        this.locks.add(job.lock)
        try {
          log('Run job', job.type, job.action)
          await this.runJob(job)
          complete = true
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
    if (this.syncers) {
      return
    }
    this.syncers = {}
    for (const name of Object.keys(Syncers)) {
      try {
        const setting = await findOrCreateSetting({ type: name })
        if (!setting) {
          console.log('no setting for', name)
          continue
        }
        const syncer = Syncers[name](setting)
        this.syncers[name] = syncer
        if (!this[name]) {
          this[name] = syncer
        }
      } catch (err) {
        console.log('error starting syncer', name)
        console.log(err)
      }
    }
  }

  failJob = async (job: Job, lastError) => {
    try {
      job.status = 3
      job.lastError = lastError
      job.tries += 1
      await job.save()
    } catch (err) {
      if (err.message && err.message.indexOf('cant save deleted document')) {
        return
      }
      console.log(err)
    }
  }

  runJob = async (job: Job) => {
    log('runJob()', job.type, job.action)
    job.status = Job.statuses.PROCESSING
    job.tries += 1
    await job.save()
    if (!this.syncers) {
      return
    }
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
      log('runJob() done', job.type, job.action)
    } catch (error) {
      console.log('error running syncer', error)
      job.status = Job.statuses.FAILED
      job.lastError = getRxError(error)
      await job.save()
    }
  }
}
