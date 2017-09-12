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
  @watch user: ?User = () => User.findOne()
  @watch lastPending: ?Array<Job> = () => Job.lastPending()
  @watch
  syncers = async () => {
    console.log('run syncers', this.user)
    if (!this.user) {
      return {}
    }
    console.time('run API.jobs.syncers')
    const res = {}
    for (const name of Object.keys(Syncers)) {
      console.log('Starting syncer', name)
      const Syncer = new Syncers[name](this)
      await Syncer.start()
      console.log('Syncer started:', name)
      res[name] = Syncer
    }
    console.timeEnd('end API.jobs.syncers')
    return res
  }

  start = async () => {
    this.watchJobs()
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
      () => this.lastPending,
      async job => {
        if (!job) {
          return
        }
        console.log('Pending job: ', job.type, job.action)
        if (this.locks.has(job.id)) {
          return
        }
        this.locks.add(job.id)
        try {
          await this.runJob(job)
        } catch (error) {
          const lastError = getRxError(error)
          console.log('JOB ERROR', lastError)
          await job.update({
            status: 3,
            lastError,
            tries: 3,
          })
        }
        this.locks.delete(job.id)
      }
    )
  }

  runJob = async (job: Job) => {
    console.log('Running', job.id, job.type)
    await job.update({
      percent: 0,
      status: Job.status.PROCESSING,
      tries: job.tries + 1,
    })

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
    }

    // update job
    await job.update({ percent: 100, status: Job.status.COMPLETED })
    console.log('Job completed:', job.type, job.action, job.id)
  }
}
