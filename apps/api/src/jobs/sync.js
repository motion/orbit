// @flow
import { store, watch } from '@mcro/black/store'
import * as Syncers from './syncers'
import { Job, User } from '@mcro/models'

const SOURCE_TO_SYNCER = {
  github: Syncers.Github,
}

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
export default class Sync {
  locks: Set<string> = new Set()
  jobWatcher: ?Subscription = null

  @watch user: ?User = () => User.findOne()

  @watch pendingJobs: ?Array<Job> = () => Job.pending()

  @watch
  syncers = () => {
    if (!this.user) {
      return {}
    }
    const syncers = {}
    for (const name of Object.keys(SOURCE_TO_SYNCER)) {
      const Syncer = new SOURCE_TO_SYNCER[name]({ user: this.user })
      Syncer.start()
      console.log('Syncer started:', name)
      syncers[name] = Syncer
    }
    return syncers
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
      () => this.pendingJobs,
      async jobs => {
        console.log('Pending jobs: ', jobs.length)
        for (const job of jobs) {
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
