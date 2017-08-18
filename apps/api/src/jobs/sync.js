// @flow
import { Job } from '@mcro/models'
import type { Observable } from 'rxjs'
import * as Syncers from './syncers'

const SOURCE_TO_SYNCER = {
  github: Syncers.Github,
}

export default class Sync {
  locks: Set<string> = new Set()
  jobWatcher: Observable
  activeSyncers = []

  start = () => {
    this.setupSyncers()
    this.watchJobs()
  }

  dispose = () => {
    this.jobWatcher.unsubscribe()
    this.disposeSyncers()
  }

  setupSyncers = async () => {
    for await (const name of Object.keys(Syncers)) {
      const Syncer = new Syncers[name]()
      await Syncer.start()
      this.activeSyncers.push(Syncer)
    }
  }

  disposeSyncers = async () => {
    for await (const syncer of this.activeSyncers) {
      await syncer.dispose()
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
        } catch (e) {
          console.log('ERROR', e)
          await job.update({ status: 3, lastError: e.message, tries: 3 })
        }
        this.locks.delete(job.id)
      }
    })
  }

  runJob = async (job: Job) => {
    console.log('Running', job.id)
    await job.update({
      percent: 0,
      status: Job.status.PROCESSING,
      tries: job.tries + 1,
    })

    if (job.type === 'sync' && SOURCE_TO_SYNCER[job.info.source]) {
      const Syncer = SOURCE_TO_SYNCER[job.info.source]
      try {
        await Syncer.run(job)
      } catch (e) {
        job.update({ status: Job.status.FAILED, lastError: e })
      }
    }

    // update job
    await job.update({ percent: 100, status: Job.status.COMPLETED })
  }
}
