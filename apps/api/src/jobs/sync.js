// @flow
import { Job } from '@mcro/models'
import type { Observable } from 'rxjs'
import * as Syncers from './syncers'

const SOURCE_TO_SYNCER = {
  github: Syncers.Github,
}

function getRxError({ message, stack }) {
  try {
    const message = JSON.parse(message)
    console.log(JSON.stringify(message, 0, 2))
  } catch (e) {
    // nothing
  }
  return { message, stack }
}

export default class Sync {
  locks: Set<string> = new Set()
  jobWatcher: Observable
  syncers = {}

  start = async () => {
    await this.setupSyncers()
    this.watchJobs()
  }

  dispose = () => {
    this.jobWatcher.unsubscribe()
    this.disposeSyncers()
  }

  setupSyncers = async () => {
    for await (const name of Object.keys(SOURCE_TO_SYNCER)) {
      const Syncer = new SOURCE_TO_SYNCER[name]()
      await Syncer.start()
      this.syncers[name] = Syncer
    }
  }

  disposeSyncers = async () => {
    for await (const name of Object.keys(this.syncers)) {
      await this.syncers[name].dispose()
    }
  }

  watchJobs = () => {
    this.jobWatcher = Job.pending().$.subscribe(async jobs => {
      console.log('Pending jobs: ', jobs.length)
      for (const job of jobs) {
        if (this.locks.has(job.id)) {
          return
        }
        this.locks.add(job.id)
        try {
          await this.runJob(job)
        } catch (error) {
          console.log('ERROR')
          const lastError = getRxError(error)
          await job.update({
            status: 3,
            lastError,
            tries: 3,
          })
        }
        this.locks.delete(job.id)
      }
    })
  }

  runJob = async (job: Job) => {
    console.log('Running', job.id, job.type)
    // await job.update({
    //   percent: 0,
    //   status: Job.status.PROCESSING,
    //   tries: job.tries + 1,
    // })

    const syncer = this.syncers[job.type]

    if (syncer) {
      try {
        await syncer.run(job)
      } catch (e) {
        console.log('error running syncer', e)
        // await job.update({ status: Job.status.FAILED, lastError: e })
      }
    }

    // update job
    // await job.update({ percent: 100, status: Job.status.COMPLETED })
  }
}
