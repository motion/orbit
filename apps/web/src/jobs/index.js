// @flow
import { store, watch } from '@mcro/black/store'
import * as Syncers from './syncers'
import { Job, User } from '@mcro/models'

function getRxError(error: Error) {
  const { message, stack } = error

  try {
    const parsedMessage = JSON.parse(message)
    console.log(JSON.stringify(parsedMessage, null, 2))
  } catch (e) {
    // nothing
  }
  return { message, stack }
}

@store
export default class Jobs {
  locks: Set<string> = new Set()
  @watch user: ?User = (() => User.findOne(): any)
  @watch pending: ?Array<Job> = (() => Job.pending(): any)
  syncers: ?Object = null

  willMount = async () => {
    this.watchJobs()

    this.react(
      () => this.user,
      async user => {
        if (!user) {
          return
        }
        if (!this.syncers) {
          this.syncers = {}
          for (const name of Object.keys(Syncers)) {
            const Syncer = new Syncers[name](this)
            if (Syncer.start) {
              await Syncer.start()
            }
            this.syncers[name] = Syncer
          }
        }
      }
    )
  }

  get github() {
    return this.syncers.github
  }

  dispose = async () => {
    await this.disposeSyncers()
  }

  disposeSyncers = async () => {
    for (const name of Object.keys(this.syncers)) {
      await this.syncers[name].dispose()
    }
  }

  watchJobs = () => {
    this.react(
      () => this.pending,
      async jobs => {
        if (!jobs || !jobs.length) {
          return
        }
        for (const job of jobs) {
          if (!job) {
            return
          }
          if (this.locks.has(job.lock)) {
            console.log('Already locked job:', job.lock)
            // return
          }
          let completed = false

          // expire stale jobs
          setTimeout(async () => {
            if (!completed) {
              await this.failJob(job, { message: 'timed out---' })
              this.locks.delete(job.lock)
              console.log('removed stale job', job.lock)
            }
          }, 1000 * 60 * 2) // 2 min

          this.locks.add(job.lock)
          try {
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
      true
    )
  }

  failJob = (job: Job, lastError) =>
    job.update({
      status: 3,
      lastError,
      tries: 3,
    })

  runJob = async (job: Job) => {
    console.log('Running job', job.type, job.action)
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
        await syncer.run(job)
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
    console.log('Job completed:', job.type, job.action, job.id)
  }
}
